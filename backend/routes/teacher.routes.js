import express from "express";

import {
	createTeacher,
	getTeachers,
	getAvailableTeachers,
	deleteTeacher,
	getEvaluationRecord,
	getTeacherById,
	getTeacherByEmail,
	getTeacherEvalutorId,
	getTeacherCreationRecord,
	deleteAllTeachers,
} from "../controllers/teacher.controller.js";

const router = express.Router();

router.get("/", getTeachers);
router.get("/:teacherId", getTeacherById);
router.get("/available-teachers/:eventId", getAvailableTeachers);
router.get("/:teacherId/evaluator-id/:eventId", getTeacherEvalutorId);
router.get("/evaluation-record/:teacherId", getEvaluationRecord);
router.get("/creation-record/:teacherId", getTeacherCreationRecord);
router.post("/email", getTeacherByEmail);
router.post("/", createTeacher);
router.delete("/:id", deleteTeacher);
router.delete("/", deleteAllTeachers);

export default router;
