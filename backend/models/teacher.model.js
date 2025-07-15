import mongoose from "mongoose";
import { Buffer } from "buffer";

const TeacherSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	department: {
		type: String,
		required: true,
		enum: ["CSE", "ISE", "ECE", "AIML", "AIDS", "CSAIML", "CSDS"], // Add or adjust based on your college
	},
	profilePicture: {
		data: Buffer,
		contentType: String,
	},
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
export default Teacher;
