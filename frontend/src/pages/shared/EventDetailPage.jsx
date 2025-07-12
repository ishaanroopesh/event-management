// import { Container, Typography, CircularProgress, Box, Paper, Button, Chip, Grid, Divider } from "@mui/material";
// import React, { useState, useEffect, useContext } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useEventStore } from "../../store/event.js";
// import { useTeacherStore } from "../../store/teacher.js";
// import { formatDateForInput } from "../../utils/dateFormat.jsx";
// import { AuthContext } from "../../context/AuthContext";
// import BackButton from "../../components/BackButton.jsx";
// import ParticipantTable from "../../components/tables/ParticipantTable";

// const statusColors = {
// 	pending: "warning",
// 	ongoing: "primary",
// 	completed: "default",
// 	open: "success",
// };

// const EventDetailPage = () => {
// 	const { eventId } = useParams();
// 	const { fetchEventById } = useEventStore();
// 	const { findTeacher, fetchTeacherCreationRecord } = useTeacherStore();
// 	const [event, setEvent] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState("");
// 	const { user, role } = useContext(AuthContext);
// 	const [isCreator, setIsCreator] = useState(false);

// 	useEffect(() => {
// 		const loadEvent = async () => {
// 			try {
// 				setLoading(true);
// 				setError("");
// 				const eventData = await fetchEventById(eventId);
// 				if (eventData) {
// 					setEvent({
// 						...eventData,
// 						date: formatDateForInput(eventData.date),
// 					});
// 				} else {
// 					setError("Event not found.");
// 				}
// 			} catch (error) {
// 				setError("Failed to load event data.");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		loadEvent();
// 	}, [eventId, fetchEventById]);

// 	useEffect(() => {
// 		const checkCreator = async () => {
// 			if (!user || role !== "teacher") return;
// 			const response = await findTeacher(user.email);
// 			if (response.success) {
// 				const creationData = await fetchTeacherCreationRecord(response.data._id);
// 				const createdIds = creationData.map((ev) => ev._id);
// 				setIsCreator(createdIds.includes(eventId));
// 			}
// 		};
// 		checkCreator();
// 	}, [user, role, eventId]);

// 	if (loading) {
// 		return (
// 			<Container>
// 				<CircularProgress />
// 			</Container>
// 		);
// 	}

// 	if (error) {
// 		return (
// 			<Container>
// 				<Typography color="error">{error}</Typography>
// 			</Container>
// 		);
// 	}

// 	const isPending = event?.status === "pending";
// 	const isCompleted = event?.status === "completed";
// 	const isAdmin = role === "admin";
// 	const hasCriteria = event?.criteria?.length > 0;

// 	return (
// 		<Container maxWidth="md" sx={{ my: 4, alignItems: "center" }}>
// 			<BackButton />
// 			{event ? (
// 				<>
// 					<Paper elevation={4} sx={{ padding: 4, borderRadius: 3, alignItems: "center" }}>
// 						<Grid container justifyContent="space-between" alignItems="center">
// 							<Grid item>
// 								<Typography variant="h4" fontWeight={600}>
// 									{event.name}
// 								</Typography>
// 								<Typography variant="subtitle1" color="textSecondary">
// 									{event.type}
// 								</Typography>
// 							</Grid>
// 							<Grid item>
// 								<Chip
// 									label={event.status.toUpperCase()}
// 									color={statusColors[event.status] || "default"}
// 									sx={{ fontWeight: 600, fontSize: "0.9rem" }}
// 								/>
// 							</Grid>
// 						</Grid>
// 						{event.poster && (
// 							<Box
// 								sx={{
// 									width: "100%",
// 									maxWidth: 500,
// 									aspectRatio: "1 / 1",
// 									overflow: "hidden",
// 									borderRadius: 2,
// 									my: 3,
// 									marginLeft: "auto", // Add these two lines
// 									marginRight: "auto",
// 								}}
// 							>
// 								<img
// 									src={`/api/events/poster/${eventId}`}
// 									alt={`${event.name} poster`}
// 									style={{
// 										width: "100%",
// 										height: "100%",
// 										objectFit: "cover",
// 										borderRadius: "8px",
// 										display: "block",
// 									}}
// 									loading="lazy"
// 									onError={(e) => {
// 										e.target.onerror = null;
// 										e.target.src = "/fallback-image.jpg";
// 									}}
// 								/>
// 							</Box>
// 						)}

// 						<Divider sx={{ my: 2 }} />

// 						<Typography variant="body1" sx={{ mb: 1 }}>
// 							<strong>Date:</strong> {event.date}
// 						</Typography>

// 						<Typography variant="body1" sx={{ mb: 2 }}>
// 							<strong>Description:</strong> {event.description}
// 						</Typography>

// 						<Grid container spacing={2} sx={{ mt: 1 }}>
// 							{isPending && isAdmin && (
// 								<Grid item>
// 									<Button variant="contained" color="primary" component={Link} to={`/admin/event/edit/${eventId}`}>
// 										Edit Event
// 									</Button>
// 								</Grid>
// 							)}

// 							{isPending && role === "teacher" && isCreator && (
// 								<Grid item>
// 									<Button variant="contained" color="primary" component={Link} to={`/teacher/event/edit/${eventId}`}>
// 										Edit Event
// 									</Button>
// 								</Grid>
// 							)}

// 							{isAdmin && event.status !== "completed" && hasCriteria && (
// 								<Grid item>
// 									<Button variant="outlined" color="info" component={Link} to={`/admin/evaluators/${eventId}`}>
// 										Manage Evaluators
// 									</Button>
// 								</Grid>
// 							)}

// 							{role === "teacher" && event.status !== "completed" && isCreator && hasCriteria && (
// 								<Grid item>
// 									<Button variant="outlined" color="info" component={Link} to={`/teacher/manage/evaluators/${eventId}`}>
// 										Manage Evaluators
// 									</Button>
// 								</Grid>
// 							)}

// 							{role === "teacher" && hasCriteria && (
// 								<Grid item>
// 									<Button variant="outlined" color="info" component={Link} to={`/teacher/view/evaluators/${eventId}`}>
// 										View Evaluators
// 									</Button>
// 								</Grid>
// 							)}

// 							{isAdmin && isPending && (
// 								<Grid item>
// 									<Button variant="outlined" color="secondary" component={Link} to="/admin/home">
// 										Go to Events (Approve this)
// 									</Button>
// 								</Grid>
// 							)}

// 							{isCompleted && hasCriteria && (
// 								<Grid item>
// 									<Button variant="contained" color="success" component={Link} to={`/event-results/${eventId}`}>
// 										View Results
// 									</Button>
// 								</Grid>
// 							)}
// 						</Grid>
// 					</Paper>

// 					{!isPending && isAdmin && (
// 						<Box mt={5}>
// 							<Typography variant="h5" gutterBottom>
// 								Participants
// 							</Typography>
// 							<ParticipantTable />
// 						</Box>
// 					)}
// 				</>
// 			) : (
// 				<Typography>No event details found.</Typography>
// 			)}
// 		</Container>
// 	);
// };

// export default EventDetailPage;

import {
	Container,
	Typography,
	CircularProgress,
	Box,
	Paper,
	Button,
	Chip,
	Grid,
	Divider,
	Stack,
	Alert,
	List,
	ListItem,
	ListItemText,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEventStore } from "../../store/event.js";
import { useTeacherStore } from "../../store/teacher.js";
// Using a display-friendly date formatter is better here
// import { formatDateTime } from "../../utils/dateFormat";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../../components/BackButton.jsx";
import ParticipantTable from "../../components/tables/ParticipantTable";
import ReportUploadDialog from "../../components/ReportUploadDialog";

// Dummy function if you don't have one. Replace with your actual utility.
const formatDateTime = (dateString) => {
	if (!dateString) return "N/A";
	const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
	return new Date(dateString).toLocaleString("en-US", options);
};

const EventDetailPage = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const { fetchEventById, updateEvent, uploadEventReport, deleteEvent } = useEventStore();
	const { findTeacher, fetchTeacherCreationRecord } = useTeacherStore();
	const { user, role } = useContext(AuthContext);

	// Page State
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isCreator, setIsCreator] = useState(false);

	// Dialog States
	const [statusModalOpen, setStatusModalOpen] = useState(false);
	const [denyModalOpen, setDenyModalOpen] = useState(false);
	const [reportDialogOpen, setReportDialogOpen] = useState(false);
	const [newStatus, setNewStatus] = useState("");

	const loadEvent = async () => {
		try {
			setLoading(true);
			setError("");
			const eventData = await fetchEventById(eventId);
			if (eventData) {
				setEvent(eventData);
			} else {
				setError("Event not found.");
			}
		} catch (err) {
			setError("Failed to load event data.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadEvent();
	}, [eventId, fetchEventById]);

	useEffect(() => {
		const checkCreator = async () => {
			if (!user || role !== "teacher" || !event) return;
			const response = await findTeacher(user.email);
			if (response.success) {
				const creationData = await fetchTeacherCreationRecord(response.data._id);
				const createdIds = creationData.map((ev) => ev._id);
				setIsCreator(createdIds.includes(eventId));
			}
		};
		checkCreator();
	}, [user, role, event, findTeacher, fetchTeacherCreationRecord]);

	const handleOpenStatusModal = (status) => {
		setNewStatus(status);
		setStatusModalOpen(true);
	};

	const handleCloseStatusModal = () => {
		setStatusModalOpen(false);
		setNewStatus("");
	};

	const confirmStatusUpdate = async () => {
		if (!newStatus) return;

		try {
			setLoading(true);
			await updateEvent(eventId, { status: newStatus });
			setEvent((prev) => ({ ...prev, status: newStatus }));
			setSuccess(`Event successfully updated to '${newStatus}'.`);
			// Removed navigation so the admin stays on the page
		} catch (err) {
			setError("Failed to update event status.");
		} finally {
			setLoading(false);
			handleCloseStatusModal();
		}
	};

	const confirmDenyEvent = async () => {
		try {
			setLoading(true);
			const { success, message } = await deleteEvent(eventId);
			if (success) {
				setSuccess("Event has been denied and deleted successfully. Redirecting...");
				setTimeout(() => navigate("/admin/home"), 2000);
			} else {
				setError(message || "Failed to deny the event.");
			}
		} catch (err) {
			setError(err.message || "An unexpected error occurred while denying the event.");
		} finally {
			setLoading(false);
			setDenyModalOpen(false);
		}
	};

	const handleUploadReport = async (file, summary) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("summary", summary);

			const res = await uploadEventReport(eventId, formData);

			if (res.success) {
				setSuccess("Report uploaded successfully.");
				loadEvent(); // Refresh event details to show report
			} else {
				setError(res.message);
			}
		} catch (err) {
			console.error("Upload error:", err);
			setError("Failed to upload report.");
		}
	};

	const getStatusChipColor = (status) => {
		const colors = {
			pending: "warning",
			open: "success",
			ongoing: "secondary",
			completed: "primary",
		};
		return colors[status] || "default";
	};

	if (loading && !event) {
		return (
			<Container sx={{ display: "flex", justifyContent: "center", my: 5 }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error && !event) {
		return (
			<Container sx={{ my: 4 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	if (!event) {
		return (
			<Container>
				<Typography>No event details found.</Typography>
			</Container>
		);
	}

	const isAdmin = role === "admin";
	const isPending = event.status === "pending";
	const isOpen = event.status === "open";
	const isOngoing = event.status === "ongoing";
	const isCompleted = event.status === "completed";
	const hasCriteria = event.criteria && event.criteria.length > 0;
	const canEdit = isPending && (isAdmin || isCreator);
	const canManageReport = isCompleted && (isAdmin || isCreator);
	const showParticipants = !isPending && (isAdmin || isCreator);

	return (
		<Container maxWidth="lg" sx={{ my: 4 }}>
			<BackButton />
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity="success" sx={{ mb: 2 }}>
					{success}
				</Alert>
			)}

			<Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mb: 4, borderRadius: 3 }}>
				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent="space-between"
					alignItems="flex-start"
					mb={3}
					spacing={2}
				>
					<Box>
						<Typography variant="h3" fontWeight={700} gutterBottom>
							{event.name}
						</Typography>
						<Stack direction="row" spacing={2} alignItems="center">
							<Chip
								label={event.status.toUpperCase()}
								color={getStatusChipColor(event.status)}
								sx={{ fontWeight: 600 }}
							/>
							<Typography variant="subtitle1" color="textSecondary">
								{event.type} • {event.department}
							</Typography>
						</Stack>
					</Box>
					{isAdmin && (
						<Stack direction="row" spacing={1.5} flexWrap="wrap">
							{isPending && (
								<>
									<Button variant="contained" color="success" onClick={() => handleOpenStatusModal("open")}>
										Approve Event
									</Button>
									<Button variant="contained" color="error" onClick={() => setDenyModalOpen(true)}>
										Deny Event
									</Button>
								</>
							)}
							{isOpen && (
								<Button variant="contained" color="secondary" onClick={() => handleOpenStatusModal("ongoing")}>
									Start Event
								</Button>
							)}
							{isOngoing && (
								<Button variant="contained" color="primary" onClick={() => handleOpenStatusModal("completed")}>
									Mark as Completed
								</Button>
							)}
						</Stack>
					)}
				</Stack>

				{event.poster && (
					<Box
						sx={{
							width: "100%",
							maxWidth: 500,
							aspectRatio: "1 / 1",
							overflow: "hidden",
							borderRadius: 2,
							my: 3,
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<img
							src={`/api/events/poster/${eventId}`}
							alt={`${event.name} poster`}
							style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", display: "block" }}
							loading="lazy"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/fallback-image.jpg";
							}}
						/>
					</Box>
				)}

				<Grid container spacing={5}>
					<Grid item xs={12} md={7}>
						<Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
							Event Details
						</Typography>
						<Typography variant="body1" paragraph sx={{ whiteSpace: "pre-wrap" }}>
							{event.description || "No description provided."}
						</Typography>
						<Divider sx={{ my: 2 }} />
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">
									Date & Time
								</Typography>
								<Typography>{formatDateTime(event.date)}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">
									Registration Deadline
								</Typography>
								<Typography>{formatDateTime(event.registerBy)}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">
									Participation
								</Typography>
								<Typography>{event.teamEvent ? `Team (Max ${event.teamSize} members)` : "Individual"}</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle2" color="textSecondary">
									Registered
								</Typography>
								<Typography>{event.participantCount || 0} Participants</Typography>
							</Grid>
						</Grid>
						{hasCriteria && (
							<>
								<Divider sx={{ my: 2 }} />
								<Typography variant="h6" sx={{ fontWeight: 600 }}>
									Evaluation Criteria
								</Typography>
								<List dense>
									{event.criteria.map((c) => (
										<ListItem key={c._id}>
											<ListItemText primary={c.criteriaName} secondary={`Max Score: ${c.maxScore}`} />
										</ListItem>
									))}
								</List>
							</>
						)}
					</Grid>
					<Grid item xs={12} md={5}>
						<Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
							Event Management
						</Typography>
						<Stack spacing={2}>
							{canEdit && (
								<Button
									variant="outlined"
									component={Link}
									to={isAdmin ? `/admin/event/edit/${eventId}` : `/teacher/event/edit/${eventId}`}
								>
									Edit Event Details
								</Button>
							)}
							{canManageReport &&
								(event.report?.file ? (
									<Button
										variant="contained"
										color="info"
										onClick={() => window.open(`/api/events/report/${eventId}`, "_blank")}
									>
										View Event Report
									</Button>
								) : (
									<Button variant="outlined" color="info" onClick={() => setReportDialogOpen(true)}>
										Upload Event Report
									</Button>
								))}
							{hasCriteria && (
								<Button
									variant="outlined"
									component={Link}
									to={isAdmin || isCreator ? `/admin/evaluators/${eventId}` : `/teacher/view/evaluators/${eventId}`}
								>
									{isAdmin || isCreator ? "Manage Evaluators" : "View Evaluators"}
								</Button>
							)}
							{isCompleted && hasCriteria && (
								<Button variant="contained" color="success" component={Link} to={`/event-results/${eventId}`}>
									View Final Results
								</Button>
							)}
						</Stack>
					</Grid>
				</Grid>
			</Paper>

			{showParticipants && (
				<Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
					<Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
						Participant List
					</Typography>
					<ParticipantTable eventId={eventId} isTeamEvent={event.teamEvent} />
				</Paper>
			)}

			{/* --- DIALOGS --- */}

			<Dialog open={statusModalOpen} onClose={handleCloseStatusModal}>
				<DialogTitle>Confirm Action</DialogTitle>
				<DialogContent>
					{/* MODIFIED: Conditional message added here */}
					{event?.status !== "pending" && (
						<Typography variant="h4" sx={{ fontStyle: "italic", color: "text.secondary", mb: 1 }}>
							The event will be automatically updated anyway....
						</Typography>
					)}
					<DialogContentText sx={{ mb: 2 }}>
						Are you sure you want to set the status of <strong>{event.name}</strong> to{" "}
						<strong>{newStatus.toUpperCase()}</strong>?
					</DialogContentText>
					{event?.status === "pending" && (
						<Typography variant="h5" sx={{ fontStyle: "bold", color: "text.secondary", mb: 1 }}>
							<strong>You will not be able to make any changes to the event after this action.</strong>
						</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseStatusModal}>Cancel</Button>
					<Button onClick={confirmStatusUpdate} color="primary" variant="contained" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={denyModalOpen} onClose={() => setDenyModalOpen(false)}>
				<DialogTitle>Confirm Deny Event</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to deny and permanently delete the event <strong>{event.name}</strong>? This action
						cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDenyModalOpen(false)}>Cancel</Button>
					<Button onClick={confirmDenyEvent} color="error" variant="contained" autoFocus>
						Confirm Deny
					</Button>
				</DialogActions>
			</Dialog>

			<ReportUploadDialog
				open={reportDialogOpen}
				onClose={() => setReportDialogOpen(false)}
				eventId={eventId}
				onSuccess={() => {
					setReportDialogOpen(false);
					loadEvent();
				}}
			/>
		</Container>
	);
};

export default EventDetailPage;
