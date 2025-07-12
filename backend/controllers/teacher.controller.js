import mongoose from "mongoose";
import Event from "../models/event.model.js";
import Teacher from "../models/teacher.model.js";
import Evaluator from "../models/evaluator.model.js";

export const getTeachers = async (req, res) => {
	try {
		const teachers = await Teacher.find({});
		res.status(200).json({ success: true, data: teachers });
	} catch (error) {
		console.error("Error in retrieving Teachers");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getTeacherById = async (req, res) => {
	const { teacherId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(teacherId)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const teacher = await Teacher.findById(teacherId);
		if (!teacher) {
			return res.status(404).json({ success: false, message: "Teacher Not Found" });
		}
		res.status(200).json({ success: true, data: teacher });
	} catch (error) {
		console.error("Error loading the teacher data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createTeacher = async (req, res) => {
	const newTeacher = new Teacher(req.body);

	try {
		newTeacher.save();
		res.status(200).json({ success: true, data: newTeacher });
	} catch (error) {
		console.error("Error in creating Teacher");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteTeacher = async (req, res) => {
	const { id } = req.params();

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Teacher.findById(id)) {
			return res.status(404).json({ success: false, message: "Teacher not found" });
		}
		Teacher.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Teacher deleted" });
	} catch (error) {
		console.error("Error in deleting Teacher");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllTeachers = async (req, res) => {
	try {
		const deletionResult = await Teacher.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} teacher records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) teacher records.`,
			deletedCount: deletionResult.deletedCount,
		});
	} catch (error) {
		console.error("Error deleting all teachers:", error);
		res.status(500).json({
			success: false,
			message: "Server Error: Could not delete teacher records.",
			error: error.message,
		});
	}
};

// / Get available teachers (not assigned as evaluators) for an event
export const getAvailableTeachers = async (req, res) => {
	try {
		const { eventId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			return res.status(400).json({ success: false, message: "Invalid Event ID" });
		}

		// Fetch all teachers
		const allTeachers = await Teacher.find({});

		// Fetch already assigned teachers
		const assignedEvaluators = await Evaluator.find({ eventId: new mongoose.Types.ObjectId(eventId) }).select(
			"teacherId"
		);

		const assignedTeacherIds = assignedEvaluators.map((e) => e.teacherId.toString());

		// Filter available teachers
		const availableTeachers = allTeachers.filter((teacher) => !assignedTeacherIds.includes(teacher._id.toString()));

		res.status(200).json({ success: true, data: availableTeachers });
	} catch (error) {
		console.error("Error fetching available teachers:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const getEvaluationRecord = async (req, res) => {
	try {
		const { teacherId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(teacherId)) {
			return res.status(400).json({ success: false, message: "Invalid Evaluator ID" });
		}

		const evaluationRecord = await Evaluator.find({ teacherId: new mongoose.Types.ObjectId(teacherId) })
			.select("eventId")
			.populate({ path: "eventId", select: "name type participantCount" });

		res.status(200).json({ success: true, data: evaluationRecord });
	} catch (error) {
		console.error("Error fetching evaluation records", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const getTeacherCreationRecord = async (req, res) => {
	try {
		const { teacherId } = req.params;

		// Validate teacherId format
		if (!mongoose.Types.ObjectId.isValid(teacherId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid Teacher ID format",
			});
		}

		// Find events created by this teacher
		const events = await Event.find({
			createdBy: new mongoose.Types.ObjectId(teacherId),
			createdByModel: "Teacher",
		}).select("name description type date status teamEvent teamSize participantCount");

		// Check if any events were found
		if (!events.length) {
			return res.status(200).json({
				success: true,
				message: "No events found for this teacher",
				data: [],
			});
		}

		res.status(200).json({
			success: true,
			count: events.length,
			data: events,
		});
	} catch (error) {
		console.error("Error fetching teacher events:", error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};

export const getTeacherByEmail = async (req, res) => {
	try {
		const { email } = req.body; // Use req.body instead of req.params
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const teacher = await Teacher.findOne({ email });

		if (!teacher) {
			return res.status(404).json({ success: false, message: "Teacher not found" });
		}

		console.log(teacher);
		res.status(200).json({ success: true, data: teacher });
	} catch (error) {
		console.error("Error fetching teacher by email:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const getTeacherEvalutorId = async (req, res) => {
	const { teacherId, eventId } = req.params;

	try {
		const assignedEvaluator = await Evaluator.findOne({
			eventId: new mongoose.Types.ObjectId(eventId),
			teacherId: new mongoose.Types.ObjectId(teacherId),
		});

		if (!assignedEvaluator) {
			return res.status(404).json({ message: "Evaluator not found" });
		}

		res.status(200).json({ success: true, data: assignedEvaluator._id });
	} catch (error) {
		console.error("Error fetching teacher's evaluation ID:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
