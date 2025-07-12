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
import { useEffect, useState, useContext } from "react";
import BackButton from "../../components/BackButton.jsx";

const StudentRegistrations = () => {
	const { user, role, logout } = useContext(AuthContext);
	const { findStudent } = useStudentStore();
	const [student, setStudent] = useState(null);
	const [loading, setLoading] = useState(true);

	const { fetchStudentById, fetchParticipationRecord } = useStudentStore();
	const [participationRecords, setParticipationRecords] = useState([]);

	useEffect(() => {
		const loadStudent = async () => {
			try {
				const response = await findStudent(user.email);
				if (response.success) {
					setStudent(response.data);
					setLoading(false);
				} else {
					console.error(response.message);
				}
			} catch (error) {
				console.error("Failed to load student data.", error);
			}
		};
		loadStudent();
	}, [user.email, findStudent]);

	useEffect(() => {
		const loadParticipationRecords = async () => {
			try {
				// Fetch the specific event by ID
				const participationRecordData = await fetchParticipationRecord(student._id);
				console.log(participationRecordData);
				if (participationRecordData) {
					setParticipationRecords(participationRecordData);
					setLoading(false);
				} else {
					console.error(error);
				}
			} catch (error) {
				console.error("Failed to load participation data.");
			}
		};
		loadParticipationRecords();
	}, [student, fetchParticipationRecord]);

	// if (loading) return <Typography>Loading...</Typography>;

	return (
		!loading && (
			<div>
				{/* Student Info Card */}
				<BackButton />
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
										{role === "student" && (
											<Button
												variant="contained"
												color="primary"
												component={Link}
												to={`/student/student-score/${record.eventId._id}/${record._id}`}
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
		)
	);
};

export default StudentRegistrations;
