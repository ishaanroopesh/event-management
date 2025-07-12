import express from "express";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import eventRoutes from "./routes/event.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import participantRoutes from "./routes/participant.routes.js";
import evaluatorRoutes from "./routes/evaluator.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import Student from "./models/student.model.js";
import Teacher from "./models/teacher.model.js";
import "./services/updateEventStatus.service.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/evaluators", evaluatorRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/chat", chatRoutes);

// --- OAuth2 Client Setup ---
const getOAuth2Client = () => {
	const { client_id, client_secret, redirect_uris } = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), "backend", "config", "credentials.json"))
	).web;

	if (!client_id || !client_secret || !redirect_uris || !redirect_uris[0]) {
		throw new Error("OAuth credentials or redirect URIs are missing or invalid");
	}

	return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
};

// --- Google Authentication Routes ---
app.get("/auth/google", (req, res) => {
	const oAuth2Client = getOAuth2Client();
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
	});
	res.redirect(authUrl);
});

const departmentMap = {
	cs: "CSE",
	cse: "CSE",
	ise: "ISE",
	ece: "ECE",
	aiml: "AIML",
	ainds: "AIDS",
	aids: "AIDS",
	csainml: "CSML",
	csaiml: "CSML",
	csnds: "CSDS",
	csds: "CSDS",
};

app.get("/auth/google/callback", async (req, res) => {
	const code = req.query.code;
	if (!code) return res.status(400).json({ message: "No code provided" });

	try {
		const oAuth2Client = getOAuth2Client();
		const { tokens } = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(tokens);

		// Fetch user info
		const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
		const userInfo = await oauth2.userinfo.get();
		const email = userInfo.data.email;
		const name = userInfo.data.name;

		// Determine user role and department
		let role = "unknown";
		let department = null;
		let superAdmin = false;

		if (email && email.endsWith("@cmrit.ac.in")) {
			const localPart = email.split("@")[0];
			const studentRegex = /^[a-zA-Z]{2,5}\d{2}([a-zA-Z]{2,4})$/;

			if (localPart.startsWith("hod.") || localPart.startsWith("principal")) {
				role = "admin";
				if (localPart.startsWith("hod.")) {
					const deptCode = localPart.substring(4).toLowerCase();
					department = departmentMap[deptCode] || null;
				}
			} else {
				const studentMatch = localPart.match(studentRegex);
				if (studentMatch && studentMatch[1]) {
					role = "student";
					const deptCode = studentMatch[1].toLowerCase();
					department = departmentMap[deptCode] || null;
				} else {
					role = "teacher";
				}
			}
		} else {
			return res.status(403).json({ message: "Unauthorized: Only CMRIT users can log in" });
		}

		let registered = false;
		if (role === "student") {
			registered = !!(await Student.exists({ email }));
		} else if (role === "teacher") {
			registered = !!(await Teacher.exists({ email }));
		} else if (role === "admin") {
			registered = !!(await Admin.exists({ email }));
			const admin = await Admin.findOne({ email });
			superAdmin = admin?.superAdmin === true;
		}

		const payload = {
			email,
			name,
			role,
			registered,
			...(department && { department }),
			...(role === "admin" && { superAdmin }),
		};

		const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
		res.redirect(`http://localhost:5173/auth/callback?token=${jwtToken}`);
	} catch (error) {
		console.error("Error during Google callback:", error);
		res.status(500).json({ message: "Authentication Failed" });
	}
});

// --- Start Server ---
app.listen(port, () => {
	connectDB();
	console.log(`Server running at http://localhost:${port}`);
});
