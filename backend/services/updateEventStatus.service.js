import cron from "node-cron";
import Event from "../models/event.model.js";

// cron.schedule("* * * * *", async () => {
cron.schedule("*/15 * * * *", async () => {
	console.log("[Cron] Checking and updating event statuses...");
	try {
		const now = new Date();

		const events = await Event.find({
			status: { $in: ["open", "ongoing"] },
		});

		const updates = [];

		for (const event of events) {
			const eventDate = new Date(event.date);
			const registerBy = new Date(event.registerBy);

			if (event.status === "open") {
				if (now >= registerBy) {
					event.status = "ongoing";
					updates.push(event.save());
					console.log(`Event '${event.name}' is now ONGOING.`);
				}
			}

			if (event.status === "ongoing") {
				if (now > eventDate) {
					event.status = "completed";
					updates.push(event.save());
					console.log(`Event '${event.name}' is now COMPLETED.`);
				}
			}
		}

		await Promise.all(updates);
		console.log("[Cron] Event status check complete.");
	} catch (err) {
		console.error("[Cron] Error updating event statuses:", err);
	}
});
