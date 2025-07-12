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
	Button,
} from "@mui/material";
import { useStudentStore } from "../../store/student.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton.jsx";

import { useEffect, useState, useContext } from "react";

const StudentDetails = () => {
	const { user, role, logout } = useContext(AuthContext);

	const { studentId } = useParams();
	const { fetchStudentById, fetchParticipationRecord } = useStudentStore();
	const [student, setStudent] = useState(null);
	const [participationRecords, setParticipationRecords] = useState([]);

	useEffect(() => {
		const loadParticipationRecords = async () => {
			try {
				// Fetch the specific event by ID
				const participationRecordData = await fetchParticipationRecord(studentId); // Fetch only this event
				if (participationRecordData) {
					setParticipationRecords(participationRecordData);
				} else {
					console.error(error);
				}
			} catch (error) {
				console.error("Failed to load participation data.");
			}
		};
		loadParticipationRecords();
	}, [studentId, fetchParticipationRecord]);

	useEffect(() => {
		const loadStudent = async () => {
			try {
				const studentData = await fetchStudentById(studentId);
				if (studentData) {
					setStudent(studentData);
				} else {
					console.error(error);
				}
			} catch (error) {
				console.error("Failed to load student data.");
			}
		};
		loadStudent();
	}, [studentId, fetchStudentById]);

	// if (loading) return <Typography>Loading...</Typography>;

	return (
		<div>
			<BackButton />
			{/* Student Info Card */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h5">{student?.name}</Typography>
					<Typography>Email: {student?.email}</Typography>
				</CardContent>
			</Card>

			{/* Participation Record Table */}
			<Typography variant="h6" gutterBottom>
				Participation Record
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Event Name</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>Score</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{participationRecords.map((record) => (
							<TableRow key={record._id}>
								<TableCell>{record.eventId?.name}</TableCell>
								<TableCell>{record.eventId?.type}</TableCell>
								<TableCell>
									{role === "admin" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/admin/student-score/${record.eventId._id}/${record._id}`}
										>
											View
										</Button>
									)}
									{role === "teacher" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/teacher/student-score/${record.eventId._id}/${record._id}`}
										>
											View
										</Button>
									)}
								</TableCell>
								{/* <TableCell>{record.eventId?.participantCount}</TableCell> */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default StudentDetails;
