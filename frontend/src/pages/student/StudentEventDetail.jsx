// import { useState, useEffect, useContext } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Box, Button, Typography, Paper, Divider, CircularProgress, Stack } from "@mui/material";
// import RegistrationConfirmationModal from "../../components/RegistrationConfirmationModal";
// import { useEventStore } from "../../store/event";
// import { useStudentStore } from "../../store/student";
// import { AuthContext } from "../../context/AuthContext.jsx";
// import BackButton from "../../components/BackButton.jsx";

// const StudentEventDetail = () => {
// 	const { eventId } = useParams();
// 	const { user } = useContext(AuthContext);
// 	const { findStudent, findIfIsRegistered } = useStudentStore();
// 	const { fetchEventById } = useEventStore();

// 	const [event, setEvent] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState("");
// 	const [student, setStudent] = useState(null);
// 	const [isRegistered, setIsRegistered] = useState(false);
// 	const [participantId, setParticipantId] = useState(null);
// 	const [isModalOpen, setIsModalOpen] = useState(false);

// 	useEffect(() => {
// 		const loadEvent = async () => {
// 			try {
// 				setLoading(true);
// 				const eventData = await fetchEventById(eventId);
// 				if (eventData) {
// 					setEvent(eventData);
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
// 		const loadStudent = async () => {
// 			try {
// 				const response = await findStudent(user.email);
// 				if (response.success) {
// 					setStudent(response.data);
// 				}
// 			} catch (error) {
// 				console.error("Failed to load student data.", error);
// 			}
// 		};
// 		loadStudent();
// 	}, [user.email, findStudent]);

// 	useEffect(() => {
// 		const checkRegistration = async () => {
// 			if (!student) return;

// 			try {
// 				const registerStatus = await findIfIsRegistered(student._id, eventId);
// 				if (registerStatus) {
// 					setIsRegistered(registerStatus.isRegistered);
// 					if (registerStatus.participantId) {
// 						setParticipantId(registerStatus.participantId);
// 					}
// 				}
// 			} catch (error) {
// 				console.error("Error checking registration status:", error);
// 			}
// 		};

// 		if (student) {
// 			checkRegistration();
// 		}
// 	}, [eventId, student, findIfIsRegistered]);

// 	const handleRegistrationSuccess = () => setIsRegistered(true);
// 	const handleOpenModal = () => setIsModalOpen(true);
// 	const handleCloseModal = () => setIsModalOpen(false);

// 	if (loading) {
// 		return (
// 			<Box display="flex" justifyContent="center" alignItems="center" height="70vh">
// 				<CircularProgress color="primary" />
// 			</Box>
// 		);
// 	}

// 	if (error) {
// 		return (
// 			<Box p={3}>
// 				<Typography variant="h6" color="error">
// 					{error}
// 				</Typography>
// 			</Box>
// 		);
// 	}

// 	return (
// 		<Box p={3} display="flex" justifyContent="center" alignItems="center">
// 			<Paper
// 				elevation={6}
// 				sx={{
// 					width: "100%",
// 					maxWidth: 800,
// 					padding: 4,
// 					borderRadius: 3,
// 					backgroundColor: "white",
// 				}}
// 			>
// 				<BackButton />
// 				<Box
// 					sx={{
// 						width: "100%",
// 						height: 200,
// 						background: `url("https://source.unsplash.com/800x200/?college,event") center/cover`,
// 						borderRadius: 2,
// 						mb: 3,
// 					}}
// 				/>
// 				<Typography variant="h4" fontWeight="bold" gutterBottom>
// 					{event.name}
// 				</Typography>

// 				<Typography variant="body1" sx={{ mb: 2 }}>
// 					{event.description}
// 				</Typography>

// 				<Divider sx={{ my: 2 }} />

// 				<Typography variant="body2" gutterBottom>
// 					Event Type: <strong>{event.teamEvent ? "Team-based" : "Individual"}</strong>
// 				</Typography>

// 				<Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
// 					<Button
// 						variant="contained"
// 						color="primary"
// 						onClick={handleOpenModal}
// 						disabled={isRegistered || event.status !== "open"}
// 					>
// 						{isRegistered ? "Already Registered" : event.status === "ongoing" ? "Registrations Closed" : "Register"}
// 					</Button>

// 					{event.status === "completed" && event.resultsPublished === true && (
// 						<>
// 							<Button variant="outlined" color="info" component={Link} to={`/event-results/${eventId}`}>
// 								View Public Results
// 							</Button>
// 						</>
// 					)}
// 				</Stack>

// 				{isModalOpen && (
// 					<RegistrationConfirmationModal
// 						event={event}
// 						eventId={event._id}
// 						eventTeam={event.teamEvent}
// 						teamSize={event.teamSize}
// 						onClose={handleCloseModal}
// 						onSuccess={handleRegistrationSuccess}
// 					/>
// 				)}
// 			</Paper>
// 		</Box>
// 	);
// };

// export default StudentEventDetail;

// import React, { useState, useEffect, useContext } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
// 	Box,
// 	Button,
// 	Typography,
// 	Paper,
// 	Divider,
// 	CircularProgress,
// 	Stack,
// 	Chip, // Added for status display
// 	Grid, // Added for better layout control
// } from "@mui/material";
// import RegistrationConfirmationModal from "../../components/RegistrationConfirmationModal";
// import { useEventStore } from "../../store/event";
// import { useStudentStore } from "../../store/student";
// import { AuthContext } from "../../context/AuthContext.jsx";
// import BackButton from "../../components/BackButton.jsx";
// import { formatDateForInput } from "../../utils/dateFormat.jsx";

// // Define status colors for consistency with the new structure
// const statusColors = {
// 	pending: "warning",
// 	ongoing: "primary",
// 	completed: "default",
// 	open: "success",
// 	// You might need 'closed' or other states depending on your backend
// };

// const StudentEventDetail = () => {
// 	const { eventId } = useParams();
// 	const { user, role } = useContext(AuthContext); // Get role from AuthContext
// 	const { findStudent, findIfIsRegistered } = useStudentStore();
// 	const { fetchEventById } = useEventStore();

// 	const [event, setEvent] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState("");
// 	const [student, setStudent] = useState(null);
// 	const [isRegistered, setIsRegistered] = useState(false);
// 	const [participantId, setParticipantId] = useState(null); // Keep this if needed for linking to scores
// 	const [isModalOpen, setIsModalOpen] = useState(false);

// 	// Effect to load event data
// 	useEffect(() => {
// 		const loadEvent = async () => {
// 			try {
// 				setLoading(true);
// 				setError(""); // Clear previous errors
// 				const eventData = await fetchEventById(eventId);
// 				if (eventData) {
// 					setEvent(eventData);
// 				} else {
// 					setError("Event not found.");
// 				}
// 			} catch (error) {
// 				console.error("Failed to load event data:", error); // Log for debugging
// 				setError("Failed to load event data. Please try again.");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		loadEvent();
// 	}, [eventId, fetchEventById]); // Dependencies: eventId and fetchEventById

// 	// Effect to load student data
// 	useEffect(() => {
// 		const loadStudent = async () => {
// 			if (!user?.email) return; // Only proceed if user email is available

// 			try {
// 				const response = await findStudent(user.email);
// 				if (response.success) {
// 					setStudent(response.data);
// 				} else {
// 					console.warn("Student data not found for current user email.");
// 				}
// 			} catch (error) {
// 				console.error("Failed to load student data:", error);
// 				// Optionally set an error state for student loading if critical
// 			}
// 		};
// 		loadStudent();
// 	}, [user?.email, findStudent]); // Dependencies: user.email and findStudent

// 	// Effect to check registration status
// 	useEffect(() => {
// 		const checkRegistration = async () => {
// 			if (!student || !event) return; // Ensure both student and event are loaded

// 			try {
// 				const registerStatus = await findIfIsRegistered(student._id, event._id); // Use event._id
// 				if (registerStatus) {
// 					setIsRegistered(registerStatus.isRegistered);
// 					if (registerStatus.participantId) {
// 						setParticipantId(registerStatus.participantId);
// 					}
// 				} else {
// 					setIsRegistered(false); // Explicitly set to false if not found
// 				}
// 			} catch (error) {
// 				console.error("Error checking registration status:", error);
// 				setIsRegistered(false); // Assume not registered on error
// 			}
// 		};

// 		if (student && event) {
// 			// Run only when both are available
// 			checkRegistration();
// 		}
// 	}, [eventId, student, event, findIfIsRegistered]); // Add 'event' to dependencies

// 	const handleRegistrationSuccess = () => {
// 		setIsRegistered(true);
// 		setIsModalOpen(false); // Close modal on successful registration
// 		// Optionally, you might want to refetch student data to get the new participantId
// 		// or ensure your onSuccess handler in the modal returns the participantId.
// 	};
// 	const handleOpenModal = () => setIsModalOpen(true);
// 	const handleCloseModal = () => setIsModalOpen(false);

// 	// --- Conditional Renderings for Loading/Error States ---
// 	if (loading) {
// 		return (
// 			<Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
// 				<CircularProgress color="primary" />
// 			</Box>
// 		);
// 	}

// 	if (error) {
// 		return (
// 			<Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
// 				<Typography variant="h6" color="error" textAlign="center">
// 					{error}
// 				</Typography>
// 			</Box>
// 		);
// 	}

// 	// --- Pre-calculate derived states for cleaner JSX ---
// 	const isEventOpenForRegistration = event?.status === "open";
// 	const isEventCompleted = event?.status === "completed";
// 	const hasResultsPublished = event?.resultsPublished === true;
// 	const hasCriteria = event?.criteria?.length > 0; // Assuming criteria still means score calculation

// 	return (
// 		<Box p={3} display="flex" justifyContent="center">
// 			<Paper
// 				elevation={6}
// 				sx={{
// 					width: "100%",
// 					maxWidth: 800,
// 					padding: 4,
// 					borderRadius: 3,
// 					backgroundColor: "white",
// 				}}
// 			>
// 				<BackButton />

// 				{/* Event Header with Name, Type, and Status Chip */}
// 				<Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
// 					<Grid item>
// 						<Typography variant="h4" fontWeight={600} gutterBottom>
// 							{event.name}
// 						</Typography>
// 						<Typography variant="subtitle1" color="textSecondary">
// 							Event Type: <strong>{event.teamEvent ? "Team-based" : "Individual"}</strong>
// 						</Typography>
// 					</Grid>
// 					<Grid item>
// 						<Chip
// 							label={event.status?.toUpperCase()}
// 							color={statusColors[event.status] || "default"}
// 							sx={{ fontWeight: 600, fontSize: "0.9rem" }}
// 						/>
// 					</Grid>
// 				</Grid>

// 				{/* Poster Display */}
// 				{event.poster && (
// 					<Box
// 						sx={{
// 							width: "100%",
// 							maxWidth: 500, // Adjust as needed
// 							aspectRatio: "1 / 1", // For square posters, change if needed
// 							overflow: "hidden",
// 							borderRadius: 2,
// 							my: 3,
// 							mx: "auto", // Center the image horizontally
// 						}}
// 					>
// 						{/* Assuming your backend serves poster data at this endpoint */}
// 						<img
// 							src={`/api/events/poster/${eventId}`}
// 							alt={`${event.name} poster`}
// 							style={{
// 								width: "100%",
// 								height: "100%",
// 								objectFit: "cover", // Ensures image covers the box without distortion
// 								borderRadius: "inherit", // Inherit border-radius from parent Box
// 								display: "block", // Removes extra space below image
// 							}}
// 							loading="lazy"
// 							onError={(e) => {
// 								e.target.onerror = null;
// 								e.target.src = "/fallback-image.jpg"; // Fallback image if poster fails to load
// 							}}
// 						/>
// 					</Box>
// 				)}

// 				<Divider sx={{ my: 2 }} />

// 				<Typography variant="body1" sx={{ mb: 2 }}>
// 					<strong>Description:</strong> {event.description}
// 				</Typography>

// 				<Typography variant="body2" gutterBottom>
// 					<strong>Date:</strong> {formatDateForInput(event.date)}
// 				</Typography>

// 				<Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
// 					{/* Register Button */}
// 					<Button
// 						variant="contained"
// 						color="primary"
// 						onClick={handleOpenModal}
// 						disabled={isRegistered || !isEventOpenForRegistration}
// 					>
// 						{isRegistered ? "Already Registered" : !isEventOpenForRegistration ? "Registrations Closed" : "Register"}
// 					</Button>

// 					{/* View Public Results Button */}
// 					{isEventCompleted && hasResultsPublished && (
// 						<Button variant="outlined" color="info" component={Link} to={`/event-results/${eventId}`}>
// 							View Public Results
// 						</Button>
// 					)}

// 					{/* View My Score Button (if applicable and registered) */}
// 					{isRegistered && isEventCompleted && hasCriteria && participantId && (
// 						<Button
// 							variant="outlined"
// 							color="secondary"
// 							component={Link}
// 							to={`/student/student-score/${event._id}/${participantId}`}
// 						>
// 							View My Score
// 						</Button>
// 					)}
// 				</Stack>

// 				{isModalOpen && (
// 					<RegistrationConfirmationModal
// 						event={event}
// 						eventId={event._id}
// 						eventTeam={event.teamEvent}
// 						teamSize={event.teamSize}
// 						onClose={handleCloseModal}
// 						onSuccess={handleRegistrationSuccess}
// 					/>
// 				)}
// 			</Paper>
// 		</Box>
// 	);
// };

// export default StudentEventDetail;

import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
	Box,
	Button,
	Typography,
	Paper,
	Divider,
	CircularProgress,
	Stack,
	Chip,
	Grid,
	// Add List, ListItem, ListItemText for rendering criteria
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import RegistrationConfirmationModal from "../../components/RegistrationConfirmationModal";
import { useEventStore } from "../../store/event";
import { useStudentStore } from "../../store/student";
import { AuthContext } from "../../context/AuthContext.jsx";
import BackButton from "../../components/BackButton.jsx";
import { formatDateForInput } from "../../utils/dateFormat.jsx";

// Define status colors for consistency
const statusColors = {
	pending: "warning",
	ongoing: "primary",
	completed: "default",
	open: "success",
};

const StudentEventDetail = () => {
	const { eventId } = useParams();
	const { user, role } = useContext(AuthContext);
	const { findStudent, findIfIsRegistered } = useStudentStore();
	const { fetchEventById } = useEventStore();

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [student, setStudent] = useState(null);
	const [isRegistered, setIsRegistered] = useState(false);
	const [participantId, setParticipantId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Effect to load event data
	useEffect(() => {
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
			} catch (error) {
				console.error("Failed to load event data:", error);
				setError("Failed to load event data. Please try again.");
			} finally {
				setLoading(false);
			}
		};
		loadEvent();
	}, [eventId, fetchEventById]);

	// Effect to load student data
	useEffect(() => {
		const loadStudent = async () => {
			if (!user?.email) return;

			try {
				const response = await findStudent(user.email);
				if (response.success) {
					setStudent(response.data);
				} else {
					console.warn("Student data not found for current user email.");
				}
			} catch (error) {
				console.error("Failed to load student data:", error);
			}
		};
		loadStudent();
	}, [user?.email, findStudent]);

	// Effect to check registration status
	useEffect(() => {
		const checkRegistration = async () => {
			if (!student || !event) return;

			try {
				const registerStatus = await findIfIsRegistered(student._id, event._id);
				if (registerStatus) {
					setIsRegistered(registerStatus.isRegistered);
					if (registerStatus.participantId) {
						setParticipantId(registerStatus.participantId);
					}
				} else {
					setIsRegistered(false);
				}
			} catch (error) {
				console.error("Error checking registration status:", error);
				setIsRegistered(false);
			}
		};

		if (student && event) {
			checkRegistration();
		}
	}, [eventId, student, event, findIfIsRegistered]);

	const handleRegistrationSuccess = () => {
		setIsRegistered(true);
		setIsModalOpen(false);
	};
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	// --- Conditional Renderings for Loading/Error States ---
	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
				<CircularProgress color="primary" />
			</Box>
		);
	}

	if (error) {
		return (
			<Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
				<Typography variant="h6" color="error" textAlign="center">
					{error}
				</Typography>
			</Box>
		);
	}

	// --- Pre-calculate derived states for cleaner JSX ---
	const isEventOpenForRegistration = event?.status === "open";
	const isEventCompleted = event?.status === "completed";
	const hasResultsPublished = event?.resultsPublished === true;
	const hasCriteria = event?.criteria?.length > 0;

	return (
		<Box p={3} display="flex" justifyContent="center">
			<Paper
				elevation={6}
				sx={{
					width: "100%",
					maxWidth: 800,
					padding: 4,
					borderRadius: 3,
					backgroundColor: "white",
				}}
			>
				<BackButton />

				{/* Event Header with Name, Type, and Status Chip */}
				<Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
					<Grid item>
						<Typography variant="h4" fontWeight={600} gutterBottom>
							{event.name}
						</Typography>
						<Typography variant="subtitle1" color="textSecondary">
							Event Type: <strong>{event.teamEvent ? "Team-based" : "Individual"}</strong>
						</Typography>
					</Grid>
					<Grid item>
						<Chip
							label={event.status?.toUpperCase()}
							color={statusColors[event.status] || "default"}
							sx={{ fontWeight: 600, fontSize: "0.9rem" }}
						/>
					</Grid>
				</Grid>

				{/* Poster Display */}
				{event.poster && (
					<Box
						sx={{
							width: "100%",
							maxWidth: 500,
							aspectRatio: "1 / 1",
							overflow: "hidden",
							borderRadius: 2,
							my: 3,
							mx: "auto",
						}}
					>
						<img
							src={`/api/events/poster/${eventId}`}
							alt={`${event.name} poster`}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								borderRadius: "inherit",
								display: "block",
							}}
							loading="lazy"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/fallback-image.jpg";
							}}
						/>
					</Box>
				)}

				<Divider sx={{ my: 2 }} />

				<Typography variant="body1" sx={{ mb: 2 }}>
					<strong>Description:</strong> {event.description}
				</Typography>

				<Typography variant="body2" gutterBottom>
					<strong>Date:</strong> {formatDateForInput(event.date)}
				</Typography>
				<Typography variant="body2" gutterBottom>
					<strong>Registration Deadline:</strong> {formatDateForInput(event.registerBy)}
				</Typography>
				{event.teamEvent && (
					<Typography variant="body2" gutterBottom>
						<strong>Team Size:</strong> Max {event.teamSize} members
					</Typography>
				)}

				{/* New: Evaluation Criteria Section (if criteria exist) */}
				{hasCriteria && (
					<>
						<Divider sx={{ my: 2 }} />
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Evaluation Criteria
						</Typography>
						<List dense>
							{event.criteria.map((c) => (
								<ListItem key={c._id} disablePadding>
									<ListItemText primary={c.criteriaName} secondary={`Max Score: ${c.maxScore}`} />
								</ListItem>
							))}
						</List>
					</>
				)}
				{/* End New: Evaluation Criteria Section */}

				<Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
					{/* Register Button */}
					<Button
						variant="contained"
						color="primary"
						onClick={handleOpenModal}
						disabled={isRegistered || !isEventOpenForRegistration}
					>
						{isRegistered ? "Already Registered" : !isEventOpenForRegistration ? "Registrations Closed" : "Register"}
					</Button>

					{/* View Public Results Button */}
					{isEventCompleted && hasResultsPublished && (
						<Button variant="outlined" color="info" component={Link} to={`/event-results/${eventId}`}>
							View Public Results
						</Button>
					)}

					{/* View My Score Button (if applicable and registered) */}
					{isRegistered && isEventCompleted && hasCriteria && participantId && (
						<Button
							variant="outlined"
							color="secondary"
							component={Link}
							to={`/student/student-score/${event._id}/${participantId}`}
						>
							View My Score
						</Button>
					)}
				</Stack>

				{isModalOpen && (
					<RegistrationConfirmationModal
						event={event}
						eventId={event._id}
						eventTeam={event.teamEvent}
						teamSize={event.teamSize}
						onClose={handleCloseModal}
						onSuccess={handleRegistrationSuccess}
					/>
				)}
			</Paper>
		</Box>
	);
};

export default StudentEventDetail;
