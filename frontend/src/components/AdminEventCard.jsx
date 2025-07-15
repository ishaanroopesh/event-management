import { useState, useEffect, useContext } from "react";
import { useTheme } from "@mui/material/styles";
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
	CircularProgress,
	Box,
	Chip,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	InputAdornment,
	Collapse,
	IconButton,
	Divider,
	Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BackButton from "./BackButton.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEventStore } from "../store/event.js";
import { AuthContext } from "../context/AuthContext.jsx";

const AdminEventCard = () => {
	const { user, superAdmin } = useContext(AuthContext);
	const { fetchEvents, publishResults, deleteEvent } = useEventStore();
	const theme = useTheme();
	const navigate = useNavigate();

	// State management
	const [eventsByStatus, setEventsByStatus] = useState({
		pending: [],
		open: [],
		ongoing: [],
		completed: [],
	});
	const [expandedSections, setExpandedSections] = useState({
		pending: true,
		open: true,
		ongoing: true,
		completed: true,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	// Modal states
	const [publishModalOpen, setPublishModalOpen] = useState(false);
	const [eventToPublish, setEventToPublish] = useState(null);
	const [denyDialogOpen, setDenyDialogOpen] = useState(false);
	const [eventToDeny, setEventToDeny] = useState(null);

	// Load events on component mount
	useEffect(() => {
		const loadEvents = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetchEvents();

				if (response) {
					const categorizedEvents = { pending: [], open: [], ongoing: [], completed: [] };
					response
						.filter((event) => superAdmin === true || event.department === user.department)
						.forEach((event) => categorizedEvents[event.status]?.push(event));
					setEventsByStatus(categorizedEvents);
				} else {
					setError(response.message || "Failed to load events");
				}
			} catch (error) {
				setError("Failed to load events. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, [fetchEvents, user.department, superAdmin]);

	// Helper functions
	const toggleSection = (status) => {
		setExpandedSections((prev) => ({
			...prev,
			[status]: !prev[status],
		}));
	};

	const handleDenyEvent = (event) => {
		setEventToDeny(event);
		setDenyDialogOpen(true);
	};

	const confirmDenyEvent = async () => {
		if (!eventToDeny) return;
		setLoading(true);
		try {
			const { success, message } = await deleteEvent(eventToDeny._id);
			if (success) {
				setSuccess("Event denied successfully!");
				// Refresh events list
				const response = await fetchEvents();
				if (response) {
					const categorizedEvents = { pending: [], open: [], ongoing: [], completed: [] };
					response
						.filter((event) => superAdmin === true || event.department === user.department)
						.forEach((event) => categorizedEvents[event.status]?.push(event));
					setEventsByStatus(categorizedEvents);
				}
			} else {
				setError(message || "Failed to deny the event.");
			}
		} catch (err) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
			setDenyDialogOpen(false);
		}
	};

	const handlePublishResults = (event) => {
		setEventToPublish(event);
		setPublishModalOpen(true);
	};

	const confirmPublishResults = async () => {
		if (!eventToPublish) return;
		try {
			await publishResults(eventToPublish._id);
			setEventsByStatus((prev) => {
				const updated = { ...prev };
				updated.completed = updated.completed.map((e) =>
					e._id === eventToPublish._id ? { ...e, resultsPublished: true } : e
				);
				return updated;
			});
		} catch (error) {
			console.error("Failed to publish results:", error);
		} finally {
			setPublishModalOpen(false);
			setEventToPublish(null);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "warning";
			case "open":
				return "success";
			case "ongoing":
				return "primary";
			case "completed":
				return "default";
			default:
				return "default";
		}
	};

	const handleDoubleClick = (eventId) => {
		navigate(`/admin/event/${eventId}`);
	};

	const filterBySearch = (events) =>
		events.filter((event) => event.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));

	const renderEventTable = (events, status) => {
		const filteredEvents = filterBySearch(events);
		return (
			<TableContainer component={Paper} sx={{ mt: 2, mb: 1 }}>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5" }}>
							<TableCell>
								<strong>Event Name</strong>
							</TableCell>
							<TableCell>
								<strong>Department</strong>
							</TableCell>
							<TableCell>
								<strong>Type</strong>
							</TableCell>
							<TableCell>
								<strong>Participants</strong>
							</TableCell>
							<TableCell>
								<strong>Team Event</strong>
							</TableCell>
							<TableCell>
								<strong>Date & Time</strong>
							</TableCell>
							<TableCell>
								<strong>Status</strong>
							</TableCell>
							<TableCell>
								<strong>Actions</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredEvents.map((event) => {
							const hasCriteria = event.criteria && event.criteria.length > 0;
							return (
								<TableRow
									key={event._id}
									onDoubleClick={() => handleDoubleClick(event._id)}
									sx={{
										transition: "transform 0.3s ease, box-shadow 0.3s ease",
										"&:hover": {
											transform: "scale(1.01)",
											boxShadow: 8,
											backgroundColor:
												theme.palette.mode === "dark" ? "rgba(50, 50, 50, 0.9)" : "rgba(240, 240, 240, 0.9)",
										},
									}}
								>
									<TableCell>{event.name}</TableCell>
									<TableCell>{event.department}</TableCell>
									<TableCell>{event.type}</TableCell>
									<TableCell>{event.participantCount}</TableCell>
									<TableCell>{event.teamEvent ? `Yes (Size: ${event.teamSize})` : "No"}</TableCell>
									<TableCell>{new Date(event.date).toLocaleString()}</TableCell>
									<TableCell>
										<Chip label={status} color={getStatusColor(status)} size="small" />
									</TableCell>
									<TableCell>
										{status === "pending" && (
											<Box display="flex" gap={1} flexWrap="wrap">
												<Button
													variant="contained"
													color="success"
													size="small"
													component={Link}
													to={`/admin/event/${event._id}`}
												>
													Review & Approve
												</Button>
												<Button variant="contained" color="error" size="small" onClick={() => handleDenyEvent(event)}>
													Deny
												</Button>
												{hasCriteria && (
													<Button
														variant="contained"
														color="primary"
														size="small"
														component={Link}
														to={`/admin/evaluators/${event._id}`}
													>
														Manage Evaluators
													</Button>
												)}
											</Box>
										)}
										{status === "open" && (
											<Box display="flex" gap={1} flexWrap="wrap">
												<Button
													variant="contained"
													color="secondary"
													size="small"
													component={Link}
													to={`/admin/event/${event._id}`}
												>
													Start Event
												</Button>
												{hasCriteria && (
													<Button
														variant="contained"
														color="primary"
														size="small"
														component={Link}
														to={`/admin/evaluators/${event._id}`}
													>
														Manage Evaluators
													</Button>
												)}
											</Box>
										)}
										{status === "ongoing" && (
											<Button
												variant="contained"
												color="success"
												size="small"
												component={Link}
												to={`/admin/event/${event._id}`}
											>
												Complete Event
											</Button>
										)}
										{status === "completed" && (
											<Box display="flex" gap={1} flexWrap="wrap">
												{hasCriteria && (
													<Button
														variant="contained"
														color="primary"
														size="small"
														onClick={() => handlePublishResults(event)}
														disabled={event.resultsPublished}
													>
														{event.resultsPublished ? "Results Published" : "Publish Results"}
													</Button>
												)}

												{event.report?.file && (
													<Button
														variant="contained"
														color="info"
														size="small"
														onClick={() => window.open(`/api/events/report/${event._id}`, "_blank")}
													>
														View Report
													</Button>
												)}
												{!event.report?.file && (
													<Button
														variant="contained"
														color="info"
														size="small"
														component={Link}
														to={`/admin/event/${event._id}`}
													>
														Upload Report
													</Button>
												)}
											</Box>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Card sx={{ mb: 3, bgcolor: theme.palette.mode === "dark" ? "#333" : "#fff8f8" }}>
				<CardContent>
					<Typography color="error">{error}</Typography>
				</CardContent>
			</Card>
		);
	}

	const totalEvents = Object.values(eventsByStatus).flat().length;

	return (
		<div>
			<BackButton />
			<Card sx={{ mb: 3, bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f9f9f9" }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						Event Dashboard
					</Typography>
					<Typography variant="body1">Total Events: {totalEvents}</Typography>

					<TextField
						label="Search Events"
						variant="outlined"
						fullWidth
						margin="normal"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ mt: 2 }}
					/>
				</CardContent>
			</Card>

			{success && (
				<Alert severity="success" sx={{ mb: 3 }}>
					{success}
				</Alert>
			)}

			{Object.entries(eventsByStatus).map(([status, events]) => (
				<Card key={status} sx={{ mb: 3 }}>
					<CardContent sx={{ p: 0 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								p: 2,
								cursor: "pointer",
								"&:hover": {
									backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
								},
							}}
							onClick={() => toggleSection(status)}
						>
							<Box display="flex" alignItems="center">
								<Typography variant="h6" sx={{ textTransform: "capitalize", fontWeight: 600 }}>
									{status} Events
								</Typography>
								<Chip label={events.length} size="small" color={getStatusColor(status)} sx={{ ml: 1.5 }} />
							</Box>
							<IconButton size="small">{expandedSections[status] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
						</Box>
						<Divider />
						<Collapse in={expandedSections[status]}>
							<Box sx={{ p: 2 }}>
								{events.length > 0 ? (
									renderEventTable(events, status)
								) : (
									<Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
										No {status} events found.
									</Typography>
								)}
							</Box>
						</Collapse>
					</CardContent>
				</Card>
			))}

			{/* Results Publish Confirmation Dialog */}
			<Dialog open={publishModalOpen} onClose={() => setPublishModalOpen(false)}>
				<DialogTitle>Confirm Publish</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to publish results for <strong>{eventToPublish?.name}</strong>? This action is
						irreversible.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPublishModalOpen(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={confirmPublishResults} color="primary" autoFocus>
						Publish
					</Button>
				</DialogActions>
			</Dialog>

			{/* Deny Event Confirmation Dialog */}
			<Dialog open={denyDialogOpen} onClose={() => setDenyDialogOpen(false)}>
				<DialogTitle>Confirm Deny Event</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to deny and delete the event <strong>{eventToDeny?.name}</strong>? This action cannot
						be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDenyDialogOpen(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={confirmDenyEvent} color="error" autoFocus>
						Confirm Deny
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdminEventCard;
