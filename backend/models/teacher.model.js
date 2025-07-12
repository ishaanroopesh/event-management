import mongoose from "mongoose";

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
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
export default Teacher;
