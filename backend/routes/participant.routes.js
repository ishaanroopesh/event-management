import express from "express";

import {
	createParticipant,
	getParticipants,
	getParticipantsByEvent,
	deleteParticipant,
	deleteAllParticipants,
} from "../controllers/participant.controller.js";

const router = express.Router();

router.get("/", getParticipants);
router.get("/:eventId", getParticipantsByEvent);
router.post("/", createParticipant);
router.delete("/:id", deleteParticipant);
router.delete("/", deleteAllParticipants);
export default router;
