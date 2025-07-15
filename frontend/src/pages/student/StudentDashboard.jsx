import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useStudentStore } from "../../store/student";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ProfilePictureUploadDialog from "../../components/ProfilePictureUploadDialog";

const StudentDashboard = () => {
	const { findStudent, fetchParticipationRecord, uploadProfilePicture } = useStudentStore();
	const { user } = useContext(AuthContext);

	const [student, setStudent] = useState(null);
	const [participationRecords, setParticipationRecords] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);

	// useEffect to fetch student data and participation records
	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				setLoading(true);
				const studentResponse = await findStudent(user.email);
				if (studentResponse.success) {
					setStudent(studentResponse.data);
					const records = await fetchParticipationRecord(studentResponse.data._id);
					const sortedRecords = records.sort((a, b) => {
						return new Date(b.eventId.date) - new Date(a.eventId.date);
					});
					// setParticipationRecords(records || []); // Ensure it's an array
					setParticipationRecords(sortedRecords || []); // Ensure it's an array
				} else {
					setError(studentResponse.message || "Student data not found.");
				}
			} catch (err) {
				console.error("Dashboard data loading error:", err);
				setError("Failed to load dashboard data.");
			} finally {
				setLoading(false);
			}
		};
		loadDashboardData();
	}, [user.email, findStudent, fetchParticipationRecord]); // Dependencies

	// handles successful profile picture upload (triggers page reload)
	const handleUploadSuccess = () => {
		window.location.reload();
	};

	// Loading
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

	// Ensure student data is available before rendering the dashboard content
	if (!student) {
		return (
			<Box sx={{ textAlign: "center", mt: 5 }}>
				<Typography>No student data available. Please try logging in again.</Typography>
			</Box>
		);
	}

	// --- Main Dashboard Content ---
	return (
		<Box sx={{ px: 3, py: 2 }}>
			<Card sx={{ mb: 4, bgcolor: "#f9f9f9" }}>
				<CardContent>
					<Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
						<Box>
							<Avatar
								src={`/api/students/profile-picture/${student._id}`}
								alt={student.name}
								sx={{ width: 100, height: 100 }}
								onError={(e) => {
									e.target.onerror = null;
								}}
							/>
							<Button variant="outlined" size="small" sx={{ mt: 1, ml: 2.3 }} onClick={() => setOpenDialog(true)}>
								Edit
							</Button>
						</Box>
						<Box>
							<Typography variant="h4" fontWeight="bold" gutterBottom>
								{student.name}
							</Typography>
							<Typography variant="body1">{student.department}</Typography>
							<Typography variant="body1">Email: {student.email}</Typography>
							<Typography variant="body1">USN: {student.usn}</Typography>
							<Button variant="contained" color="primary" component={Link} to="/" sx={{ mt: 2, borderRadius: 5 }}>
								Browse Events
							</Button>
						</Box>
					</Box>
				</CardContent>
			</Card>

			{/* Participation Summary */}
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Recent Participation Summary
					</Typography>
					<Typography variant="body2" sx={{ mb: 2 }}>
						You've registered for {participationRecords.length} event
						{participationRecords.length !== 1 ? "s" : ""} in total.
					</Typography>

					{participationRecords.length === 0 ? (
						<Typography variant="body2">You haven't registered for any events yet.</Typography>
					) : (
						<TableContainer component={Paper}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>Event</TableCell>
										<TableCell>Type</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Score</TableCell>
										<TableCell>Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{participationRecords.slice(0, 3).map((record) => (
										<TableRow key={record._id}>
											<TableCell>{record.eventId?.name || "Deleted"}</TableCell>
											<TableCell>{record.eventId?.type || "-"}</TableCell>
											<TableCell>{record.eventId?.status || "-"}</TableCell>
											<TableCell>{record.totalScore != null ? record.totalScore : "Pending"}</TableCell>
											<TableCell>
												{record.eventId ? (
													<Button
														size="small"
														variant="outlined"
														component={Link}
														to={`/student/student-score/${record.eventId._id}/${record._id}`}
													>
														View
													</Button>
												) : (
													<Typography variant="caption" color="text.secondary">
														Event deleted
													</Typography>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</CardContent>
			</Card>

			{/* Quick Access Buttons */}
			<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
				<Button variant="outlined" component={Link} to="/student/user/registrations">
					My Registered Events
				</Button>
				<Button variant="outlined" component={Link} to="/student/scores">
					My Scores
				</Button>
			</Box>

			{/* Profile Picture Upload Dialog */}
			{student && (
				<ProfilePictureUploadDialog
					open={openDialog}
					onClose={() => setOpenDialog(false)}
					studentId={student._id}
					uploadProfilePicture={uploadProfilePicture}
					onUploadSuccess={handleUploadSuccess}
				/>
			)}
		</Box>
	);
};

export default StudentDashboard;
