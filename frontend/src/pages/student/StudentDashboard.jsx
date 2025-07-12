// import { useParams, Link } from "react-router-dom";
// import {
// 	Card,
// 	CardContent,
// 	Typography,
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Paper,
// 	Button,
// } from "@mui/material";
// import { useStudentStore } from "../../store/student";
// import { AuthContext } from "../../context/AuthContext";

// import { useEffect, useState, useContext } from "react";

// const StudentDashboard = () => {
// 	const { findStudent, fetchParticipationRecord } = useStudentStore();
// 	const [student, setStudent] = useState(null);
// 	const [participationRecords, setParticipationRecords] = useState([]);
// 	const { user, role, logout } = useContext(AuthContext);

// 	useEffect(() => {
// 		const loadStudent = async () => {
// 			try {
// 				const response = await findStudent(user.email);
// 				if (response.success) {
// 					setStudent(response.data); // Extract `data` from response
// 				} else {
// 					console.error(response.message);
// 				}

// 				const participationRecordData = await fetchParticipationRecord(response.data._id);
// 				if (participationRecordData) setParticipationRecords(participationRecordData);
// 				else console.error("Error fetching participation records");
// 			} catch (error) {
// 				console.error("Failed to load student data.", error);
// 			}
// 		};
// 		loadStudent();
// 	}, [user.email, findStudent]);

// 	return (
// 		<div>
// 			<Card sx={{ mb: 3 }}>
// 				<CardContent>
// 					<Typography variant="h5">{student?.name}</Typography>
// 					<Typography>Email: {student?.email}</Typography>
// 					<Typography>USN: {student?.usn}</Typography>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// };

// export default StudentDashboard;

import { useParams, Link } from "react-router-dom";
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
	Box,
	CircularProgress,
} from "@mui/material";
import { useStudentStore } from "../../store/student";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useState, useContext } from "react";

const StudentDashboard = () => {
	const { findStudent, fetchParticipationRecord } = useStudentStore();
	const [student, setStudent] = useState(null);
	const [participationRecords, setParticipationRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		const loadStudent = async () => {
			try {
				const response = await findStudent(user.email);
				if (response.success) {
					setStudent(response.data);
					const participationRecordData = await fetchParticipationRecord(response.data._id);
					if (participationRecordData) {
						setParticipationRecords(participationRecordData);
					} else {
						setError("No participation record found.");
					}
				} else {
					setError(response.message || "Student not found.");
				}
			} catch (error) {
				setError("Failed to load student data.");
			} finally {
				setLoading(false);
			}
		};
		loadStudent();
	}, [user.email]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ textAlign: "center", mt: 5 }}>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ px: 3, py: 2 }}>
			<Card sx={{ mb: 4, bgcolor: "#f9f9f9" }}>
				<CardContent>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Welcome, {student?.name}
					</Typography>
					<Typography variant="body1">Email: {student?.email}</Typography>
					<Typography variant="body1">USN: {student?.usn}</Typography>

					<Button variant="contained" color="primary" component={Link} to="/" sx={{ mt: 2, borderRadius: 5 }}>
						Go to Events
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
};

export default StudentDashboard;
