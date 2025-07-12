import mongoose from "mongoose";
import Participant from "../models/participant.model.js";
import Event from "../models/event.model.js";
import Student from "../models/student.model.js";

export const getParticipants = async (req, res) => {
	try {
		const participants = await Participant.find({})
			.populate("eventId", "name type date") // Populate event details
			.populate("student", "name email usn") // Populate individual student details
			.populate("members", "name email usn"); // Populate team members
		res.status(200).json({ success: true, data: participants });
	} catch (error) {
		console.error("Error fetching participants:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getParticipantsByEvent = async (req, res) => {
	const { eventId } = req.params;
	try {
		const participants = await Participant.find({ eventId: new mongoose.Types.ObjectId(eventId) })
			.populate("student", "name email usn") // Populate individual student details
			.populate("members", "name email usn"); // Populate team members

		res.status(200).json({ success: true, data: participants });
	} catch (error) {
		console.error("Error fetching participants:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createParticipant = async (req, res) => {
	const { eventId, student, teamName, members } = req.body;

	// Check if the event exists
	const event = await Event.findById(eventId);
	if (!event) {
		return res.status(404).json({ success: false, message: "Event not found" });
	}

	// Conditional validation
	if (event.teamEvent) {
		// Ensure teamName and members are provided for team-based participation
		if (!teamName || !members || members.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Team name and members are required for team-based participation",
			});
		}

		if (members.length > event.teamSize) {
			return res.status(400).json({ success: false, message: `Maximum team size is ${event.teamSize}.` });
		}
	} else {
		// Ensure student is provided for individual participation
		if (!student) {
			return res.status(400).json({
				success: false,
				message: "Student is required for individual participation",
			});
		}

		// Check if the student exists
		const existingStudent = await Student.findById(student);
		if (!existingStudent) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}
	}

	// Create the participant
	const newParticipant = new Participant({
		eventId,
		student: event.teamEvent ? undefined : student,
		teamName: event.teamEvent ? teamName : undefined,
		members: event.teamEvent ? members : undefined,
	});

	try {
		await newParticipant.save();

		// Update participant count in the event
		event.participantCount += 1;
		await event.save();

		res.status(201).json({ success: true, data: newParticipant });
	} catch (error) {
		console.error("Error creating participant:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteParticipant = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Participant ID" });
	}

	try {
		const participant = await Participant.findById(id);
		if (!participant) {
			return res.status(404).json({ success: false, message: "Participant not found" });
		}

		// Delete the participant
		await Participant.findByIdAndDelete(id);

		// Update participant count in the associated event
		const event = await Event.findById(participant.eventId);
		if (event) {
			event.participantCount -= 1;
			await event.save();
		}

		res.status(200).json({ success: true, message: "Participant deleted" });
	} catch (error) {
		console.error("Error deleting participant:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllParticipants = async (req, res) => {
	try {
		const deletionResult = await Participant.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} participant records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) participant records.`,
			deletedCount: deletionResult.deletedCount,
		});
	} catch (error) {
		console.error("Error deleting all participants:", error);
		res.status(500).json({
			success: false,
			message: "Server Error: Could not delete participant records.",
			error: error.message,
		});
	}
};
