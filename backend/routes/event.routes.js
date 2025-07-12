import express from "express";

import {
	createEvent,
	getEvents,
	getParticularEvent,
	deleteEvent,
	updateEvent,
	getUnassignedParticipants,
	getAvailableStudentsForEvent,
	deleteAllEvents,
	uploadPoster,
	getPoster,
	createEventWithPoster,
	addEventReport,
	getEventReport,
	getLightweightEvents,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/lightweight", getLightweightEvents);
router.get("/:id", getParticularEvent);
router.get("/unassigned-participants/:eventId", getUnassignedParticipants);
router.get("/available-students/:eventId", getAvailableStudentsForEvent);
router.post("/", createEvent);
router.post("/with-poster", createEventWithPoster);
router.delete("/:id", deleteEvent);
router.delete("/", deleteAllEvents);
router.put("/:id", updateEvent);
router.post("/upload-poster", uploadPoster);
router.put("/upload-report/:eventId", addEventReport);
router.get("/poster/:eventId", getPoster);
router.get("/report/:eventId", getEventReport);

export default router;
