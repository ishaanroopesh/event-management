import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import eventRoutes from "./routes/event.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import participantRoutes from "./routes/participant.routes.js";
import evaluatorRoutes from "./routes/evaluator.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/evaluators", evaluatorRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => {
	connectDB();
	console.log(`Server started at http://localhost:${port}`);
});
