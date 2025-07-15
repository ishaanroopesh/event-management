import express from "express";

import {
	createStudent,
	getStudents,
	getStudentById,
	deleteStudent,
	getParticipationByStudent,
	getScoresByStudent,
	getStudentByEmail,
	checkStudentRegistration,
	deleteAllStudents,
	uploadProfilePicture,
	getProfilePicture,
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:studentId", getStudentById);
router.get("/participation-record/:studentId", getParticipationByStudent);
router.get("/is-registered/:studentId/:eventId", checkStudentRegistration);
router.get("/:studentId/scores", getScoresByStudent);
router.get("/profile-picture/:studentId", getProfilePicture);
router.post("/", createStudent);
router.post("/email", getStudentByEmail);
router.delete("/:id", deleteStudent);
router.delete("/", deleteAllStudents);
router.put("/upload-profile-picture", uploadProfilePicture);

export default router;
