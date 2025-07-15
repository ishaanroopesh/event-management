import mongoose from "mongoose";
import { Buffer } from "buffer";

const StudentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	usn: {
		type: String,
		required: true,
		unique: true,
	},
	department: {
		type: String,
		required: true,
		enum: ["CSE", "ISE", "ECE", "AIML", "AIDS", "CSML", "CSDS"],
	},
	profilePicture: {
		data: Buffer,
		contentType: String,
	},
});

const Student = mongoose.model("Student", StudentSchema);
export default Student;
