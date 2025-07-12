import mongoose from "mongoose";
import ExcelJS from "exceljs";
import Admin from "../models/admin.model.js";
import Event from "../models/event.model.js";
import Participant from "../models/participant.model.js";
import Evaluator from "../models/evaluator.model.js";
import Score from "../models/score.model.js";
import Student from "../models/student.model.js";

export const getAdmins = async (req, res) => {
	try {
		const admins = await Admin.find({});
		res.status(200).json({ success: true, data: admins });
	} catch (error) {
		console.error("Error loading data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getParticularAdmin = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const admin = await Admin.findById(id);
		if (!admin) {
			return res.status(404).json({ success: false, message: "Admin Not Found" });
		}
		res.status(200).json({ success: true, data: admin });
	} catch (error) {
		console.error("Error loading the admin data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getAdminByEmail = async (req, res) => {
	try {
		const { email } = req.body; // Use req.body instead of req.params
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const admin = await Admin.findOne({ email });

		if (!admin) {
			return res.status(404).json({ success: false, message: "Admin not found" });
		}

		console.log(admin);
		res.status(200).json({ success: true, data: admin });
	} catch (error) {
		console.error("Error fetching admin by email:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const createAdmin = async (req, res) => {
	const newAdmin = new Admin(req.body);

	try {
		await newAdmin.save();
		res.status(200).json({ success: true, data: newAdmin });
	} catch (error) {
		console.error("Error in creating an Admin");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAdmin = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Admin.findById(id)) {
			return res.status(404).json({ success: false, message: "Admin not found" });
		}

		await Admin.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Admin Deleted" });
	} catch (error) {
		console.error("Error in deleting the Admin");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllAdmins = async (req, res) => {
	try {
		const deletionResult = await Admin.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} admin records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) admin records.`,
			deletedCount: deletionResult.deletedCount,
		});
	} catch (error) {
		console.error("Error deleting all admins:", error);
		res.status(500).json({
			success: false,
			message: "Server Error: Could not delete admin records.",
			error: error.message,
		});
	}
};

export const updateAdmin = async (req, res) => {
	const { id } = req.params;
	const admin = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}

	try {
		const updatedAdmin = await Admin.findByIdAndUpdate(id, admin, { new: true });

		if (!updatedAdmin) {
			return res.status(404).json({ success: false, message: "Admin not found" });
		}
		res.status(200).json({ success: true, data: updatedAdmin });
	} catch (error) {
		console.error("Update was unsuccessful");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// export const exportEvents = async (req, res) => {
// 	try {
// 		// const { startDate, endDate, department, superAdmin } = req.body;
// 		const startDate = new Date("2025-04-01");
// 		const endDate = new Date("2025-05-30");
// 		const department = "CSE";
// 		const superAdmin = false;
// 		if (!startDate || !endDate) {
// 			return res.status(400).json({ success: false, message: "Start and end dates are required." });
// 		}

// 		const start = new Date(startDate);
// 		const end = new Date(endDate);

// 		const filters = {
// 			date: { $gte: start, $lte: end },
// 			status: { $ne: "pending" },
// 		};
// 		if (!superAdmin) filters.department = department;

// 		const events = await Event.find(filters).populate("createdBy").lean();

// 		const results = await Promise.all(
// 			events.map(async (event) => {
// 				const participants = await Participant.find({ eventId: event._id }).lean();
// 				const evaluators = await Evaluator.find({ eventId: event._id })
// 					.populate("teacherId")
// 					.populate("assignedStudents")
// 					.lean();

// 				return {
// 					...event,
// 					participants,
// 					evaluators,
// 				};
// 			})
// 		);
// 		console.log("Exported Events Count:", results.length);
// 		console.log("Sample Event:", results[0]);

// 		// ✅ Step: Build Excel workbook
// 		const workbook = new ExcelJS.Workbook();
// 		const sheet = workbook.addWorksheet("Events Report");

// 		sheet.columns = [
// 			{ header: "Event Name", key: "name", width: 25 },
// 			{ header: "Department", key: "department", width: 15 },
// 			{ header: "Type", key: "type", width: 15 },
// 			{ header: "Date", key: "date", width: 20 },
// 			{ header: "Status", key: "status", width: 15 },
// 			{ header: "Participants", key: "participants", width: 15 },
// 			{ header: "Evaluators", key: "evaluators", width: 20 },
// 			{ header: "Results Published", key: "resultsPublished", width: 20 },
// 		];

// 		// ✅ Add rows
// 		results.forEach((event) => {
// 			sheet.addRow({
// 				name: event.name,
// 				department: event.department,
// 				type: event.type,
// 				date: new Date(event.date).toLocaleString(),
// 				status: event.status,
// 				participants: event.participants?.length || 0,
// 				evaluators: event.evaluators?.map((ev) => ev.teacherId?.name).join(", ") || "",
// 				resultsPublished: event.resultsPublished ? "Yes" : "No",
// 			});
// 		});

// 		// ✅ Set headers for download
// 		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
// 		res.setHeader("Content-Disposition", "attachment; filename=events_report.xlsx");

// 		await workbook.xlsx.write(res);
// 		res.end();
// 	} catch (error) {
// 		console.error("Error exporting events to Excel:", error);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

export const exportEvents = async (req, res) => {
	try {
		// const { startDate, endDate, department, superAdmin } = req.body;
		const startDate = new Date("2025-04-01");
		const endDate = new Date("2025-05-30");
		const department = "CSE";
		const superAdmin = false;

		if (!startDate || !endDate) {
			return res.status(400).json({ success: false, message: "Start and end dates are required." });
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		const filters = {
			date: { $gte: start, $lte: end },
			status: { $ne: "pending" },
		};
		if (!superAdmin) filters.department = department;

		const events = await Event.find(filters).populate("createdBy").lean();

		const results = await Promise.all(
			events.map(async (event) => {
				const participants = await Participant.find({ eventId: event._id }).lean();
				const evaluators = await Evaluator.find({ eventId: event._id })
					.populate("teacherId")
					.populate("assignedStudents")
					.lean();

				return {
					...event,
					participants,
					evaluators,
				};
			})
		);

		// ✅ Step: Build Excel workbook
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet("Events Report");

		sheet.columns = [
			{ header: "Event Name", key: "name", width: 25 },
			{ header: "Description", key: "description", width: 35 },
			{ header: "Department", key: "department", width: 15 },
			{ header: "Type", key: "type", width: 15 },
			{ header: "Date", key: "date", width: 20 },
			{ header: "Status", key: "status", width: 15 },
			{ header: "Teams", key: "teams", width: 10 },
			{ header: "Participants", key: "participants", width: 15 },
			{ header: "Evaluators", key: "evaluators", width: 20 },
			{ header: "Created By", key: "createdBy", width: 25 },
			{ header: "Poster URL", key: "posterURL", width: 40 },
			{ header: "Results Published", key: "resultsPublished", width: 20 },
		];

		// ✅ Add rows
		results.forEach((event) => {
			sheet.addRow({
				name: event.name,
				description: event.description,
				department: event.department,
				type: event.type,
				date: new Date(event.date).toLocaleString(),
				status: event.status,
				teams: event.teamEvent ? event.participants.length : "-",
				participants: event.teamEvent ? event.participants.length * event.teamSize : event.participants.length,
				evaluators: event.evaluators?.map((ev) => ev.teacherId?.name).join(", ") || "",
				createdBy: event.createdBy?.name || "",
				posterURL: event.posterURL || "",
				resultsPublished: event.resultsPublished ? "Yes" : "No",
			});
		});

		// ✅ Set headers for download
		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		res.setHeader("Content-Disposition", "attachment; filename=events_report.xlsx");

		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error("Error exporting events to Excel:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const exportSingleEventToExcel = async (req, res) => {
	try {
		const { eventId } = req.params;
		if (!eventId) return res.status(400).json({ success: false, message: "Missing event ID" });

		const event = await Event.findById(eventId).populate("createdBy").lean();
		if (!event) return res.status(404).json({ success: false, message: "Event not found" });

		const participants = await Participant.find({ eventId }).lean();
		const evaluators = await Evaluator.find({ eventId })
			.populate("teacherId")
			.populate({ path: "assignedStudents" })
			.lean();

		const workbook = new ExcelJS.Workbook();
		const infoSheet = workbook.addWorksheet("Event Info");
		infoSheet.addRows([
			["Event Name", event.name],
			["Type", event.type],
			["Department", event.department],
			["Date", new Date(event.date).toLocaleString()],
			["Status", event.status],
			["Description", event.description],
			["Created By", `${event.createdBy?.name} (${event.createdBy?.email})`],
			["Poster URL", event.posterURL || "N/A"],
		]);

		// Evaluators
		const evaluatorSheet = workbook.addWorksheet("Evaluators");
		evaluatorSheet.columns = [
			{ header: "Name", key: "name", width: 20 },
			{ header: "Email", key: "email", width: 30 },
			{ header: "Assigned Count", key: "assigned", width: 15 },
		];
		evaluators.forEach((e) => {
			evaluatorSheet.addRow({
				name: e.teacherId?.name,
				email: e.teacherId?.email,
				assigned: e.assignedStudents?.length || 0,
			});
		});

		// Participants
		const participantSheet = workbook.addWorksheet("Participants");
		participantSheet.columns = event.teamEvent
			? [
					{ header: "Team Name", key: "team", width: 20 },
					{ header: "Member Name", key: "name", width: 20 },
					{ header: "USN", key: "usn", width: 15 },
					{ header: "Email", key: "email", width: 30 },
					{ header: "Department", key: "dept", width: 15 },
			  ]
			: [
					{ header: "Name", key: "name", width: 20 },
					{ header: "USN", key: "usn", width: 15 },
					{ header: "Email", key: "email", width: 30 },
					{ header: "Department", key: "dept", width: 15 },
			  ];

		for (const p of participants) {
			if (event.teamEvent) {
				const members = await Student.find({ _id: { $in: p.members } });
				members.forEach((s) => {
					participantSheet.addRow({
						team: p.teamName,
						name: s.name,
						usn: s.usn,
						email: s.email,
						dept: s.department,
					});
				});
			} else {
				const student = await Student.findById(p.student);
				participantSheet.addRow({
					name: student.name,
					usn: student.usn,
					email: student.email,
					dept: student.department,
				});
			}
		}

		// Scores (if available)
		const scores = await Score.find({ eventId }).populate("participantId").lean();
		if (scores.length > 0) {
			const scoreSheet = workbook.addWorksheet("Scores");
			const criteriaHeaders = event.criteria.map((c) => ({ header: c.criteriaName, key: c.criteriaName, width: 15 }));
			scoreSheet.columns = [
				{ header: "Participant", key: "participant", width: 25 },
				...criteriaHeaders,
				{ header: "Total", key: "total", width: 10 },
			];

			scores
				.map((s) => ({
					participant: event.teamEvent ? s.participantId?.teamName : s.participantId?.name,
					...s.scores.reduce((acc, curr) => {
						acc[curr.criteriaName] = curr.scoreValue;
						return acc;
					}, {}),
					total: s.totalScore,
				}))
				.sort((a, b) => b.total - a.total)
				.forEach((row) => scoreSheet.addRow(row));
		}

		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		res.setHeader("Content-Disposition", `attachment; filename=event_${eventId}_report.xlsx`);
		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error("Failed to export single event:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
