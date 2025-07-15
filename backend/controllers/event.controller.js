import mongoose from "mongoose";
import multer from "multer";
import sharp from "sharp";
import Event from "../models/event.model.js";
import Evaluator from "../models/evaluator.model.js";
import Student from "../models/student.model.js";
import Participant from "../models/participant.model.js";

// const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
const upload = multer();
export const getEvents = async (req, res) => {
	try {
		const events = await Event.find({});
		res.status(200).json({ success: true, data: events });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getLightweightEvents = async (req, res) => {
	try {
		const events = await Event.find({}).select("-poster -report");
		res.status(200).json({ success: true, data: events });
	} catch (error) {
		console.error("Error loading lightweight event data:", error); // Added more specific error logging
		res.status(500).json({ success: false, message: "Server Error retrieving lightweight event data" });
	}
};

export const getParticularEvent = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const event = await Event.findById(id);
		if (!event) {
			return res.status(404).json({ success: false, message: "Event Not Found" });
		}
		res.status(200).json({ success: true, data: event });
	} catch (error) {
		console.error("Error loading the event data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getAvailableStudentsForEvent = async (req, res) => {
	try {
		const { eventId } = req.params;

		// Validate event ID
		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			return res.status(400).json({ success: false, message: "Invalid event ID" });
		}

		// Check if event exists
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ success: false, message: "Event not found" });
		}

		// Get all participants for the event
		const participants = await Participant.find({ eventId: new mongoose.Types.ObjectId(eventId) }).select(
			"student members"
		);

		// Extract IDs of students who are already participants
		const registeredStudentIds = new Set();
		participants.forEach((p) => {
			if (p.student) registeredStudentIds.add(p.student.toString()); // Individual participant
			else p.members.forEach((member) => registeredStudentIds.add(member.toString())); // Team members
		});

		// Find students who are NOT registered as participants
		const availableStudents = await Student.find({
			_id: { $nin: Array.from(registeredStudentIds) },
		}).select("name email usn"); // Modify fields as needed

		res.status(200).json({ success: true, data: availableStudents });
	} catch (error) {
		console.error("Error fetching available students:", error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const createEvent = async (req, res) => {
	const newEvent = new Event(req.body);

	try {
		await newEvent.save();
		res.status(200).json({ success: true, data: newEvent });
	} catch (error) {
		console.error("Error in creating an Event");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createEventWithPoster = [
	upload.single("poster"),
	async (req, res) => {
		try {
			// ✅ Parse `req.body.data` instead of `req.body`
			const parsed = JSON.parse(req.body.data); // must match frontend append("data", JSON.stringify(...))

			const {
				name,
				description,
				date,
				type,
				department,
				createdBy,
				createdByModel,
				teamEvent,
				teamSize,
				criteria,
				registerBy,
			} = parsed;

			const fileBuffer = req.file ? await sharp(req.file.buffer).resize(1080, 1080).jpeg().toBuffer() : null;

			const newEvent = new Event({
				name,
				description,
				date,
				type,
				department,
				createdBy,
				createdByModel,
				teamEvent,
				teamSize,
				criteria,
				registerBy,
				poster: fileBuffer ? { data: fileBuffer, contentType: "image/jpeg" } : undefined,
			});

			await newEvent.save();
			res.status(201).json({ success: true, data: newEvent });
		} catch (error) {
			console.error("Error creating event with poster:", error);
			res.status(500).json({ success: false, message: "Server Error" });
		}
	},
];

export const deleteEvent = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Event.findById(id)) {
			return res.status(404).json({ success: false, message: "Event not found" });
		}

		await Event.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Event Deleted" });
	} catch (error) {
		console.error("Error in deleting the Event");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllEvents = async (req, res) => {
	try {
		const deletionResult = await Event.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} event records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) event records.`,
			deletedCount: deletionResult.deletedCount,
		});
	} catch (error) {
		console.error("Error deleting all events:", error);
		res.status(500).json({
			success: false,
			message: "Server Error: Could not delete event records.",
			error: error.message,
		});
	}
};

export const updateEvent = async (req, res) => {
	const { id } = req.params;
	const event = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedEvent = await Event.findByIdAndUpdate(id, event, { new: true });

		if (!updatedEvent) {
			return res.status(404).json({ success: false, message: "Event not found" });
		}
		res.status(200).json({ success: true, data: updatedEvent });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateEventWithPoster = [
	upload.single("poster"),
	async (req, res) => {
		try {
			const { id } = req.params;
			if (!id || !mongoose.Types.ObjectId.isValid(id)) {
				return res.status(400).json({ success: false, message: "Invalid event ID" });
			}

			const parsed = JSON.parse(req.body.data);

			const { name, description, date, type, department, teamEvent, teamSize, criteria, registerBy } = parsed;

			const updateData = {
				name,
				description,
				date,
				type,
				department,
				teamEvent,
				teamSize,
				registerBy,
			};

			// Add criteria only if present (some events don't use them)
			if (Array.isArray(criteria)) {
				updateData.criteria = criteria;
			}

			if (req.file) {
				const fileBuffer = await sharp(req.file.buffer).resize(1080, 1080).jpeg().toBuffer();
				updateData.poster = {
					data: fileBuffer,
					contentType: "image/jpeg",
				};
			}

			const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedEvent) {
				return res.status(404).json({ success: false, message: "Event not found" });
			}

			res.status(200).json({ success: true, data: updatedEvent });
		} catch (error) {
			console.error("Error updating event with poster:", error);
			res.status(500).json({ success: false, message: "Server Error" });
		}
	},
];

export const getUnassignedParticipants = async (req, res) => {
	try {
		const { eventId } = req.params;

		// Get all assigned participant IDs from evaluators
		const assignedParticipants = new Set(
			(await Evaluator.find({ eventId })).flatMap((e) => e.assignedStudents.map(String))
		);

		// Fetch unassigned participants
		const unassignedParticipants = await Participant.find({
			eventId,
			_id: { $nin: [...assignedParticipants] },
		})
			.populate("student")
			.populate("members");

		res.status(200).json({ success: true, data: unassignedParticipants });
	} catch (error) {
		console.error("Error fetching unassigned participants:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const publishEventResults = async (req, res) => {
	const { eventId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(eventId)) {
		return res.status(400).json({ success: false, message: "Invalid event ID" });
	}

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({ success: false, message: "Event not found" });
		}

		// Check if the requester is the creator (Admin/Teacher)
		if (req.user.role !== event.createdByModel || req.user.id !== String(event.createdBy)) {
			return res.status(403).json({ success: false, message: "Unauthorized to publish results" });
		}

		// Update resultsPublished to true
		event.resultsPublished = true;
		await event.save();

		res.status(200).json({ success: true, message: "Results published successfully", data: event });
	} catch (error) {
		console.error("Error publishing results:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const uploadPoster = [
	upload.single("poster"),
	async (req, res) => {
		try {
			const { eventId } = req.body;
			const fileBuffer = await sharp(req.file.buffer).resize(1080, 1080).jpeg().toBuffer();

			const updated = await Event.findByIdAndUpdate(
				eventId,
				{ poster: { data: fileBuffer, contentType: "image/jpeg" } },
				{ new: true }
			);

			if (!updated) return res.status(404).json({ success: false, message: "Event not found" });

			res.status(200).json({ success: true, message: "Poster uploaded successfully" });
		} catch (error) {
			console.error("Upload error:", error);
			res.status(500).json({ success: false, message: "Server Error" });
		}
	},
];

export const getPoster = async (req, res) => {
	const { eventId } = req.params;
	try {
		const event = await Event.findById(eventId);
		if (!event || !event.poster?.data) {
			return res.status(404).send("Poster not found");
		}
		res.set("Content-Type", event.poster.contentType);
		res.send(event.poster.data);
	} catch (error) {
		res.status(500).send("Failed to fetch poster");
	}
};

export const getEventReport = async (req, res) => {
	try {
		const { eventId } = req.params;
		const eventDetails = await Event.findById(eventId);
		const event = await Event.findById(eventId);

		if (!event || !event.report || !event.report?.file) {
			return res.status(404).json({ success: false, message: "Report not found" });
		}

		res.set("Content-Type", "application/pdf");
		res.set("Content-Disposition", `inline; filename="Report_${eventDetails.name}.pdf"`); // or 'attachment;' for download
		res.send(event.report?.file?.data);
	} catch (error) {
		console.error("Error retrieving report:", error);
		res.status(500).json({ success: false, message: "Failed to retrieve report" });
	}
};

export const addEventReport = [
	upload.single("file"),
	async (req, res) => {
		try {
			const { eventId } = req.params;
			const { summary } = req.body;
			if (!req.file) {
				return res.status(400).json({ success: false, message: "No PDF file uploaded." });
			}

			const updated = await Event.findByIdAndUpdate(
				eventId,
				{
					report: {
						summary,
						file: {
							data: req.file.buffer,
							contentType: req.file.mimetype,
						},
					},
				},
				{ new: true }
			);

			if (!updated) {
				return res.status(404).json({ success: false, message: "Event not found" });
			}
			res.status(200).json({ success: true, message: "Report added successfully" });
		} catch (error) {
			console.error("Error adding report:", error);
			res.status(500).json({ success: false, message: "Server error while adding report" });
		}
	},
];
