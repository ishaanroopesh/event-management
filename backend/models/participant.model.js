import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},

	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student",
		required: false,
	},

	teamName: { type: String, required: false }, // Only for team events
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

const Participant = mongoose.model("Participant", ParticipantSchema);
export default Participant;
