import mongoose from "mongoose";
import Score from "../models/score.model.js";
import Event from "../models/event.model.js";

export const getScores = async (req, res) => {
	try {
		const scores = await Score.find({})
			.populate("eventId", "name date")
			.populate("participantId", "student teamName")
			.populate("evaluatorId", "name");
		res.status(200).json({
			success: true,
			data: scores,
		});
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getScoresByEvent = async (req, res) => {
	const { eventId } = req.params;
	try {
		const scores = await Score.findOne({ eventId: new mongoose.Types.ObjectId(eventId) }) // Using findOne
			.populate("eventId", "name date")
			.populate("participantId", "student teamName")
			.populate("evaluatorId", "name");

		res.status(200).json({
			success: true,
			data: scores, // Return a single object, not an array
		});
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getAllScoresByEvent = async (req, res) => {
	const { eventId } = req.params;
	try {
		const scores = await Score.find({ eventId: new mongoose.Types.ObjectId(eventId) }) // Using findOne
			.populate("eventId", "name date")
			.populate("participantId", "student teamName")
			.populate("evaluatorId", "name");

		res.status(200).json({
			success: true,
			data: scores, // Return a single object, not an array
		});
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getParticipantScore = async (req, res) => {
	const { eventId, participantId } = req.params;
	try {
		const scores = await Score.findOne({
			eventId: new mongoose.Types.ObjectId(eventId),
			participantId: new mongoose.Types.ObjectId(participantId),
		})
			.populate("eventId", "name")
			// .populate("participantId", "student teamName members")
			.populate({
				path: "participantId", // 1. Populate the participantId field in Score
				select: "student teamName members",
				populate: {
					path: "members", // 3. Within participant, populate the 'members' array
					select: "name email", // 4. Select the desired fields ('name', 'email', etc.)
				},
			})
			.populate({
				path: "evaluatorId",
				populate: {
					path: "teacherId",
					select: "name",
				},
			});
		res.status(200).json({
			success: true,
			data: scores,
		});
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createScores = async (req, res) => {
	const { eventId, participantId, evaluatorId, scores, comments } = req.body;

	try {
		// Validate event existence
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ success: false, message: "Event not found" });
		}
		// Calculate total score
		const totalScore = scores.reduce((sum, score) => sum + score.scoreValue, 0);

		// Create and save score entry
		const score = new Score({
			eventId,
			participantId,
			evaluatorId,
			scores,
			totalScore,
			comments,
		});
		await score.save();

		res.status(201).json({ success: true, message: "Scores created successfully", data: score });
	} catch (error) {
		console.error("Error creating scores:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
export const deleteScore = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Score.findById(id)) {
			return res.status(404).json({ success: false, message: "Score not found" });
		}

		await Score.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Score Deleted" });
	} catch (error) {
		console.error("Error in deleting the Score");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllScores = async (req, res) => {
	try {
		const deletionResult = await Score.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} score records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) score records.`,
			deletedCount: deletionResult.deletedCount,
		});
	} catch (error) {
		console.error("Error deleting all scores:", error);
		res.status(500).json({
			success: false,
			message: "Server Error: Could not delete score records.",
			error: error.message,
		});
	}
};

export const updateScore = async (req, res) => {
	const { id } = req.params;
	const score = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedScore = await Score.findByIdAndUpdate(id, score, { new: true });

		if (!updatedScore) {
			return res.status(404).json({ success: false, message: "Score not found" });
		}
		res.status(200).json({ success: true, data: updatedScore });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
