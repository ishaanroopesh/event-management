import express from "express";

import {
	createScores,
	getScores,
	deleteScore,
	updateScore,
	getScoresByEvent,
	getParticipantScore,
	getAllScoresByEvent,
	deleteAllScores,
} from "../controllers/score.controller.js";

const router = express.Router();

router.get("/", getScores);
router.get("/:eventId", getScoresByEvent);
router.get("/all-scores/:eventId", getAllScoresByEvent);
router.get("/participant-score/:eventId/:participantId", getParticipantScore);
router.post("/", createScores);
router.delete("/:id", deleteScore);
router.delete("/", deleteAllScores);
router.put("/:id", updateScore);

export default router;
