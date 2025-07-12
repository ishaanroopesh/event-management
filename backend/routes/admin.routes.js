import express from "express";
import {
	createAdmin,
	getAdmins,
	getParticularAdmin,
	deleteAdmin,
	updateAdmin,
	getAdminByEmail,
	deleteAllAdmins,
	exportEvents,
	exportSingleEventToExcel,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/", getAdmins);
router.get("/:id", getParticularAdmin);
router.post("/", createAdmin);
router.get("/export/events", exportEvents);
router.get("/export/single-event/:eventId", exportSingleEventToExcel);
router.post("/email", getAdminByEmail);
router.delete("/:id", deleteAdmin);
router.delete("/", deleteAllAdmins);
router.put("/:id", updateAdmin);

export default router;
