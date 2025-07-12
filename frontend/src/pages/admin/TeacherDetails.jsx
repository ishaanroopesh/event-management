import { useParams } from "react-router-dom";
import {
	Card,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { getEvaluationRecord } from "../../hooks/useTeachers";
import { useTeacherStore } from "../../store/teacher";
import BackButton from "../../components/BackButton";

import { useEffect, useState } from "react";

const TeacherDetails = () => {
	const { teacherId } = useParams();
	const { fetchTeacherById, fetchEvaluationRecord } = useTeacherStore();
	const [teacher, setTeacher] = useState(null);
	const [evaluationRecords, setEvaluationRecords] = useState([]);

	useEffect(() => {
		const loadEvaluationRecords = async () => {
			try {
				// Fetch the specific event by ID
				const evaluationRecordData = await fetchEvaluationRecord(teacherId); // Fetch only this event
				if (evaluationRecordData) {
					setEvaluationRecords(evaluationRecordData);
				} else {
					console.error(error);
				}
			} catch (error) {
				console.error("Failed to load evaluation data.");
			}
		};
		loadEvaluationRecords();
	}, [teacherId, fetchEvaluationRecord]);

	useEffect(() => {
		const loadTeacher = async () => {
			try {
				const teacherData = await fetchTeacherById(teacherId);
				if (teacherData) {
					setTeacher(teacherData);
				} else {
					console.error(error);
				}
			} catch (error) {
				console.error("Failed to load teacher data.");
			}
		};
		loadTeacher();
	}, [teacherId, fetchTeacherById]);

	// if (loading) return <Typography>Loading...</Typography>;

	return (
		<div>
			<BackButton />
			{/* Teacher Info Card */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h5">{teacher?.name}</Typography>
					<Typography>Email: {teacher?.email}</Typography>
				</CardContent>
			</Card>

			{/* Evaluation Record Table */}
			<Typography variant="h6" gutterBottom>
				Evaluation Record
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Event Name</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>Participant Count</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{evaluationRecords.map((record) => (
							<TableRow key={record._id}>
								<TableCell>{record.eventId?.name}</TableCell>
								<TableCell>{record.eventId?.type}</TableCell>
								<TableCell>{record.eventId?.participantCount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeacherDetails;
