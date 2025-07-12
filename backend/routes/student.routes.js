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
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:studentId", getStudentById);
router.get("/participation-record/:studentId", getParticipationByStudent);
router.get("/is-registered/:studentId/:eventId", checkStudentRegistration);
router.get("/:studentId/scores", getScoresByStudent);
router.post("/", createStudent);
router.post("/email", getStudentByEmail);
router.delete("/:id", deleteStudent);
router.delete("/", deleteAllStudents);

export default router;
