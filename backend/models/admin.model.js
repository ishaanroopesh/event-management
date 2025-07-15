import mongoose from "mongoose";
import { Buffer } from "buffer";

const AdminSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	department: {
		type: String,
		required: false,
		enum: ["CSE", "ISE", "ECE", "AIML", "AIDS", "CSAIML", "CSDS"], // Add or adjust based on your college
	},
	superAdmin: {
		type: Boolean,
		default: false, // Set to true only for the main/global admin
	},
	profilePicture: {
		data: Buffer,
		contentType: String,
	},
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
