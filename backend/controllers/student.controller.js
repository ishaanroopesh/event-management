import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Participant from "../models/participant.model.js";
import Score from "../models/score.model.js";

export const getStudents = async (req, res) => {
	try {
		const students = await Student.find({});
		res.status(200).json({ success: true, data: students });
	} catch (error) {
		console.error("Error in retrieving Students");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getStudentById = async (req, res) => {
	const { studentId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(studentId)) {
		res.status(404).json({ success: false, message: "Invalid ObjectID" });
	}
	try {
		const student = await Student.findById(studentId);
		if (!student) {
			return res.status(404).json({ success: false, message: "Student Not Found" });
		}
		res.status(200).json({ success: true, data: student });
	} catch (error) {
		console.error("Error loading the student data");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getStudentByEmail = async (req, res) => {
	try {
		const { email } = req.body; // Use req.body instead of req.params
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const student = await Student.findOne({ email });

		if (!student) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}

		console.log(student);
		res.status(200).json({ success: true, data: student });
	} catch (error) {
		console.error("Error fetching student by email:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const createStudent = async (req, res) => {
	const newStudent = new Student(req.body);

	try {
		newStudent.save();
		res.status(200).json({ success: true, data: newStudent });
	} catch (error) {
		console.error("Error in creating Student");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteStudent = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Object ID" });
	}

	try {
		if (!Student.findById(id)) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}
		await Student.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Student deleted" });
	} catch (error) {
		console.error("Error in deleting Student");
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAllStudents = async (req, res) => {
	try {
		const deletionResult = await Student.deleteMany({});

		console.log(`Deleted ${deletionResult.deletedCount} student records.`);

		res.status(200).json({
			success: true,
			message: `Successfully deleted all (${deletionResult.deletedCount}) student records.`,
			deletedCount: deletionResult.deletedCount,
		});
	} catch (error) {
		console.error("Error deleting all students:", error);
		res.status(500).json({
			success: false,
			message: "Server Error: Could not delete student records.",
			error: error.message,
		});
	}
};

export const getParticipationByStudent = async (req, res) => {
	const { studentId } = req.params;
	try {
		const participations = await Participant.find({
			$or: [
				{ student: studentId }, // Individual participation
				{ members: studentId }, // Team participation
			],
		})
			.populate("eventId", "name date type description") // Populate event details
			.populate("members", "name email usn") // Populate team members
			.populate("student", "name email usn"); // Populate individual student details

		for (var participantion of participations) {
			console.log(participantion._id);
		}
		res.status(200).json({ success: true, data: participations });
	} catch (error) {
		console.error("Error fetching participation records:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getScoresByStudent = async (req, res) => {
	const { studentId } = req.params;

	try {
		// Find all participant entries where the student is either an individual or part of a team
		const participantIds = await Participant.find({
			$or: [
				{ student: studentId }, // Matches individual student
				{ members: studentId }, // Matches team members
			],
		}).select("_id"); // Only select the participant IDs

		const participantIdList = participantIds.map((participant) => participant._id);

		// Find scores for the matched participant IDs
		const scores = await Score.find({
			participantId: { $in: participantIdList }, // Matches any of the participant IDs
		})
			.populate("eventId", "name date") // Populate event details
			.populate({
				path: "participantId",
				populate: [
					{ path: "student", select: "name usn" },
					{ path: "members", select: "name usn" },
				],
			})
			.populate("evaluatorId", "name"); // Populate evaluator details

		res.status(200).json({ success: true, data: scores });
	} catch (error) {
		console.error("Error fetching scores for the student:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const checkStudentRegistration = async (req, res) => {
	try {
		const { eventId, studentId } = req.params;

		if (!eventId || !studentId) {
			return res.status(400).json({ success: false, message: "Missing eventId or studentId" });
		}

		// Check if there's a participant record where the student is in the "members" array
		const isRegistered = await Participant.exists({
			eventId,
			$or: [
				{ student: studentId }, // individual
				{ members: studentId }, // team
			],
		});

		res.json({ success: true, isRegistered: !!isRegistered });
	} catch (error) {
		console.error("Error checking registration:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
