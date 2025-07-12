import mongoose from "mongoose";
import Evaluator from "../models/evaluator.model.js";
import Event from "../models/event.model.js";
import Teacher from "../models/teacher.model.js";

export const getEvaluators = async (req, res) => {
	try {
		const evaluators = await Evaluator.find({}).populate("eventId", "name date").populate("teacherId", "name");
		res.status(200).json({ success: true, data: evaluators });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getEvaluatorsForEvent = async (req, res) => {
	const { eventId } = req.params;

	try {
		// const assignedEvaluators = await Evaluator.find({ eventId: new mongoose.Types.ObjectId(eventId) });
		const assignedEvaluators = await Evaluator.find({ eventId: new mongoose.Types.ObjectId(eventId) }).populate(
			"teacherId",
			"name email"
		);
		res.status(200).json({ success: true, data: assignedEvaluators });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getAssignedStudents = async (req, res) => {
	const { evaluatorId } = req.params;

	try {
		console.log("Fetching assigned students for evaluator and event...");

		// Await the query to resolve and fetch the evaluator
		// const evaluator = await Evaluator.findOne({ _id: evaluatorId }).populate({
		// 	path: "assignedStudents",
		// 	populate: [
		// 		{ path: "student", select: "name usn" }, // individual student details
		// 		{ path: "members", select: "name usn" }, // team member details
		// 	],
		// });
		const evaluator = await Evaluator.findById(evaluatorId).populate({
			path: "assignedStudents",
			populate: [
				{ path: "student", select: "name usn" }, // individual student details
				{ path: "members", select: "name usn" }, // team member details
			],
		});

		if (!evaluator) {
			return res.status(404).json({
				success: false,
				message: "Evaluator not found for this event.",
			});
		}

		// assigned students data
		res.status(200).json({ success: true, data: evaluator.assignedStudents });
	} catch (error) {
		// any unexpected errors
		console.error("Error fetching assigned students:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createEvaluator = async (req, res) => {
	const { eventId, teacherId } = req.body;

	const event = await Event.findById(eventId);
	if (!event) {
		return res.status(404).json({ success: false, message: "Event not found" });
	}
	const teacher = await Teacher.findById(teacherId);
	if (!teacher) {
		return res.status(404).json({ success: false, message: "Teacher not found" });
	}

	const newEvaluator = new Evaluator(req.body);

	try {
		await newEvaluator.save();
		res.status(200).json({ success: true, data: newEvaluator });
	} catch (error) {
		console.error("Error in creating an Evaluator");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteEvaluator = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Evaluator.findById(id)) {
			return res.status(404).json({ success: false, message: "Evaluator not found" });
		}

		await Evaluator.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Evaluator Deleted" });
	} catch (error) {
		console.error("Error in deleting the Evaluator");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllEvaluators = async (req, res) => {
	try {
		const deletionResult = await Evaluator.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} evaluator records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) evaluator records.`,
		});
	} catch (error) {
		console.error("Error deleting all evaluators:", error);
		res.status(500).json({
			success: false,
			error: "Server Error",
		});
	}
};

export const addParticipantsToEvaluator = async (req, res) => {
	const { evaluatorId } = req.params;
	const { participantIds } = req.body; // Array of student IDs

	try {
		const evaluator = await Evaluator.findById(evaluatorId);
		if (!evaluator) {
			return res.status(404).json({ success: false, message: "Evaluator not found" });
		}

		// Add students to assignedStudents array
		evaluator.assignedStudents.push(...participantIds);
		await evaluator.save();

		res.status(200).json({ success: true, message: "Participants added successfully" });
	} catch (error) {
		console.error("Error adding participants to evaluator:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateEvaluator = async (req, res) => {
	const { evaluatorId } = req.params;
	const evaluator = req.body;

	if (!mongoose.Types.ObjectId.isValid(evaluatorId)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedEvaluator = await Evaluator.findByIdAndUpdate(evaluatorId, evaluator, { new: true });

		if (!updatedEvaluator) {
			return res.status(404).json({ success: false, message: "Event not found" });
		}
		res.status(200).json({ success: true, data: updatedEvaluator });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
