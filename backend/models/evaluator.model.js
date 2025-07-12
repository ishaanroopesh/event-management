import mongoose from "mongoose";

const EvaluatorSchema = new mongoose.Schema({
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},

	teacherId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Teacher",
		required: true,
	},

	assignedStudents: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Participant",
		},
	],
});

const Evaluator = mongoose.model("Evaluator", EvaluatorSchema);
export default Evaluator;
