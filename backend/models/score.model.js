import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},

		participantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Participant",
			required: true,
		},

		evaluatorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Evaluator",
			required: true,
		},

		scores: [
			{
				criteriaName: {
					type: String,
					required: true,
				},
				scoreValue: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],

		totalScore: {
			type: Number,
			required: true, // Must be calculated and passed during submission
		},

		comments: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const Score = mongoose.model("Score", ScoreSchema);
export default Score;
