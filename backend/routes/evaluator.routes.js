import express from "express";

import {
	createEvaluator,
	getEvaluators,
	deleteEvaluator,
	getAssignedStudents,
	addParticipantsToEvaluator,
	getEvaluatorsForEvent,
	updateEvaluator,
	deleteAllEvaluators,
} from "../controllers/evaluator.controller.js";

const router = express.Router();

router.get("/", getEvaluators);
router.get("/:eventId", getEvaluatorsForEvent);
router.get("/assigned-students/:evaluatorId", getAssignedStudents);
router.post("/", createEvaluator);
router.delete("/:id", deleteEvaluator);
router.delete("/", deleteAllEvaluators);
router.put("/add-participants/:evaluatorId", addParticipantsToEvaluator);
router.put("/:evaluatorId", updateEvaluator);

export default router;
