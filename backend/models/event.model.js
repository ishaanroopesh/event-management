import mongoose from "mongoose";
import { Buffer } from "buffer";
import Participant from "./participant.model.js";
import Score from "./score.model.js";
import Evaluator from "./evaluator.model.js";

const EventSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	type: {
		type: String,
		required: true,
	},
	date: { type: Date, required: true },
	registerBy: { type: Date, required: true },
	criteria: [
		{
			criteriaName: { type: String, required: true },
			maxScore: { type: Number, required: true },
		},
	],
	participantCount: { type: Number, default: 0 },
	teamEvent: { type: Boolean, required: true, default: false },
	teamSize: {
		type: Number,
		default: 1,
		validate: {
			validator: function (value) {
				return this.teamEvent ? value > 1 : value === 1;
			},
			message: "For team events, teamSize must be >1. For individual events, it must be 1.",
		},
	},
	status: {
		type: String,
		enum: ["pending", "open", "ongoing", "completed"],
		default: "pending",
	},
	resultsPublished: { type: Boolean, default: false },

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: "createdByModel", // Dynamically reference either Admin or Teacher
	},
	createdByModel: {
		type: String,
		required: true,
		enum: ["Admin", "Teacher"], // Determines the referenced model
	},
	department: {
		type: String,
		required: true,
		enum: ["CSE", "ISE", "ECE", "AIML", "AIDS", "CSAIML", "CSDS"],
	},
	poster: {
		data: Buffer,
		contentType: String,
	},
	report: {
		summary: {
			type: String,
			default: "",
		},
		file: {
			data: Buffer,
			contentType: String,
		},
	},
});

EventSchema.pre("findOneAndDelete", async function (next) {
	try {
		const eventId = this.getQuery()._id;

		// Delete all participants related to the event
		const participants = await Participant.find({ eventId });

		const participantIds = participants.map((p) => p._id);

		// Delete participants
		await Participant.deleteMany({ eventId });

		// Delete all evaluators related to the event
		const evaluators = await Evaluator.find({ eventId });

		const evaluatorIds = evaluators.map((e) => e._id);
		await Evaluator.deleteMany({ eventId });
		// Delete related scores
		await Score.deleteMany({ participantId: { $in: participantIds } });
		await Score.deleteMany({ evaluatorId: { $in: evaluatorIds } });

		next();
	} catch (err) {
		next(err);
	}
});

const Event = mongoose.model("Event", EventSchema);
export default Event;
