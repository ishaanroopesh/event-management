// import React, { useState, useEffect, useContext } from "react";
// import {
// 	Container,
// 	Typography,
// 	TextField,
// 	Button,
// 	IconButton,
// 	Grid,
// 	ToggleButton,
// 	Select,
// 	MenuItem,
// 	InputLabel,
// 	FormControl,
// } from "@mui/material";
// import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
// import { AuthContext } from "../../context/AuthContext";
// import { useParams, useNavigate } from "react-router-dom";
// import { useEventStore } from "../../store/event.js";
// import BackButton from "../../components/BackButton.jsx";

// const EventUpdatePage = () => {
// 	const { eventId } = useParams();
// 	const navigate = useNavigate();
// 	const { user, role } = useContext(AuthContext);
// 	const { fetchEventById, updateEvent } = useEventStore();

// 	const [eventDetails, setEventDetails] = useState({
// 		name: "",
// 		description: "",
// 		date: "",
// 		type: "",
// 		criteria: [{ criteriaName: "", maxScore: 0 }],
// 		teamEvent: false,
// 		teamSize: 1,
// 	});

// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState("");
// 	const [success, setSuccess] = useState("");

// 	useEffect(() => {
// 		const loadEvent = async () => {
// 			try {
// 				const event = await fetchEventById(eventId);
// 				if (!event) throw new Error("Event not found");

// 				setEventDetails({
// 					name: event.name || "",
// 					description: event.description || "",
// 					date: event.date?.slice(0, 16) || "",
// 					type: event.type || "",
// 					criteria: event.criteria?.length > 0 ? event.criteria : [{ criteriaName: "", maxScore: 0 }],
// 					teamEvent: event.teamEvent || false,
// 					teamSize: event.teamSize || 1,
// 				});
// 			} catch (err) {
// 				setError("Failed to load event details");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		loadEvent();
// 	}, [eventId, fetchEventById]);

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setEventDetails({ ...eventDetails, [name]: value });
// 	};

// 	const handleTeamSwitch = () => {
// 		setEventDetails((prev) => ({
// 			...prev,
// 			teamEvent: !prev.teamEvent,
// 			teamSize: !prev.teamEvent ? 2 : 1,
// 		}));
// 	};

// 	const handleCriteriaChange = (index, field, value) => {
// 		const updated = [...eventDetails.criteria];
// 		updated[index][field] = value;
// 		setEventDetails({ ...eventDetails, criteria: updated });
// 	};

// 	const addCriteria = () => {
// 		setEventDetails({
// 			...eventDetails,
// 			criteria: [...eventDetails.criteria, { criteriaName: "", maxScore: 0 }],
// 		});
// 	};

// 	const removeCriteria = (index) => {
// 		const updated = eventDetails.criteria.filter((_, i) => i !== index);
// 		setEventDetails({ ...eventDetails, criteria: updated });
// 	};

// 	const isFormValid = () => {
// 		const { name, description, date, type, criteria } = eventDetails;
// 		if (!name || !description || !date || !type) return false;
// 		const nonEmptyCriteria = criteria.filter((c) => c.criteriaName.trim() || c.maxScore > 0);
// 		if (nonEmptyCriteria.length === 0) return true;
// 		return nonEmptyCriteria.every((c) => c.criteriaName && c.maxScore > 0);
// 	};

// 	const handleSubmit = async () => {
// 		if (!isFormValid()) {
// 			setError("Please fill in all required fields and ensure criteria are valid.");
// 			return;
// 		}

// 		try {
// 			setLoading(true);
// 			const { success, message } = await updateEvent(eventId, eventDetails);
// 			if (!success) {
// 				setError(message || "Failed to update the event");
// 			} else {
// 				setSuccess("Event updated successfully!");
// 				navigate(`/admin/event/${eventId}`);
// 			}
// 		} catch (err) {
// 			setError("An unexpected error occurred.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	if (loading) return <Typography>Loading...</Typography>;

// 	return (
// 		<Container>
// 			<BackButton />
// 			<Typography variant="h4" gutterBottom>
// 				Update Event
// 			</Typography>
// 			<Grid container spacing={2}>
// 				<Grid item xs={6}>
// 					<TextField
// 						fullWidth
// 						label="Event Name"
// 						name="name"
// 						value={eventDetails.name}
// 						onChange={handleChange}
// 						required
// 					/>
// 				</Grid>
// 				<Grid item xs={8}>
// 					<TextField
// 						fullWidth
// 						label="Description"
// 						name="description"
// 						value={eventDetails.description}
// 						onChange={handleChange}
// 						multiline
// 						rows={3}
// 						required
// 					/>
// 				</Grid>
// 				<Grid item xs={6}>
// 					<FormControl fullWidth required>
// 						<InputLabel>Event Type</InputLabel>
// 						<Select name="type" value={eventDetails.type} onChange={handleChange} label="Event Type">
// 							<MenuItem value="Competition">Competition</MenuItem>
// 							<MenuItem value="Hackathon">Hackathon</MenuItem>
// 							<MenuItem value="Exhibition">Exhibition</MenuItem>
// 							<MenuItem value="Seminar">Seminar</MenuItem>
// 							<MenuItem value="Workshop">Workshop</MenuItem>
// 						</Select>
// 					</FormControl>
// 				</Grid>
// 				<Grid item xs={6}>
// 					<TextField
// 						fullWidth
// 						label="Event Date"
// 						name="date"
// 						value={eventDetails.date}
// 						onChange={handleChange}
// 						type="datetime-local"
// 						required
// 						InputLabelProps={{ shrink: true }}
// 					/>
// 				</Grid>

// 				<Grid item xs={6}>
// 					<Typography variant="subtitle1">Team Event</Typography>
// 					<ToggleButton
// 						value="check"
// 						selected={eventDetails.teamEvent}
// 						onChange={handleTeamSwitch}
// 						sx={{
// 							bgcolor: eventDetails.teamEvent ? "green !important" : "red",
// 							color: "white",
// 							"&.Mui-selected": {
// 								bgcolor: "green !important",
// 								color: "white",
// 							},
// 							"&:hover": {
// 								bgcolor: eventDetails.teamEvent ? "#007a00" : "darkred",
// 							},
// 						}}
// 					>
// 						{eventDetails.teamEvent ? "Yes (Team Event)" : "No (Individual Event)"}
// 					</ToggleButton>
// 				</Grid>

// 				<Grid item xs={6}>
// 					<TextField
// 						label="Team Size"
// 						type="number"
// 						name="teamSize"
// 						value={eventDetails.teamSize}
// 						onChange={(e) => setEventDetails({ ...eventDetails, teamSize: parseInt(e.target.value) || 1 })}
// 						disabled={!eventDetails.teamEvent}
// 					/>
// 				</Grid>

// 				<Grid item xs={8}>
// 					<Typography variant="h6">Evaluation Criteria</Typography>
// 					{eventDetails.criteria.map((criterion, index) => (
// 						<Grid key={index} display="flex" alignItems="center" m={2} container>
// 							<Grid item xs={6}>
// 								<TextField
// 									label="Criteria Name"
// 									value={criterion.criteriaName}
// 									onChange={(e) => handleCriteriaChange(index, "criteriaName", e.target.value)}
// 								/>
// 							</Grid>
// 							<Grid item xs={4}>
// 								<TextField
// 									label="Max Score"
// 									type="number"
// 									value={criterion.maxScore}
// 									onChange={(e) => handleCriteriaChange(index, "maxScore", parseInt(e.target.value) || 0)}
// 								/>
// 							</Grid>
// 							{eventDetails.criteria.length > 1 && (
// 								<Grid item xs={2}>
// 									<IconButton color="error" onClick={() => removeCriteria(index)}>
// 										<RemoveCircleOutline />
// 									</IconButton>
// 								</Grid>
// 							)}
// 						</Grid>
// 					))}
// 					<Button startIcon={<AddCircleOutline />} onClick={addCriteria} sx={{ mt: 1 }}>
// 						Add Criteria
// 					</Button>
// 					<Button
// 						variant="outlined"
// 						color="error"
// 						onClick={() => setEventDetails({ ...eventDetails, criteria: [] })}
// 						sx={{ mt: 1, ml: 2 }}
// 					>
// 						Clear All Criteria
// 					</Button>
// 				</Grid>

// 				{error && (
// 					<Grid item xs={12}>
// 						<Typography color="error">{error}</Typography>
// 					</Grid>
// 				)}
// 				{success && (
// 					<Grid item xs={12}>
// 						<Typography color="success.main">{success}</Typography>
// 					</Grid>
// 				)}

// 				<Grid item xs={12}>
// 					<Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
// 						{loading ? "Updating..." : "Update Event"}
// 					</Button>
// 				</Grid>
// 			</Grid>
// 		</Container>
// 	);
// };

// export default EventUpdatePage;

import React, { useState, useEffect, useContext } from "react";
import {
	Container,
	Typography,
	TextField,
	Button,
	IconButton,
	Grid,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Box,
	ToggleButtonGroup,
	ToggleButton,
	Alert,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, CloudUpload } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEventStore } from "../../store/event.js";
import BackButton from "../../components/BackButton.jsx";

const EventUpdatePage = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const { user, role } = useContext(AuthContext);
	const { fetchEventById, updateEvent } = useEventStore();

	const [eventDetails, setEventDetails] = useState({
		name: "",
		description: "",
		date: "",
		registerBy: "",
		type: "",
		criteria: [{ criteriaName: "", maxScore: 0 }],
		teamEvent: false,
		teamSize: 1,
		department: user.department,
		hasCriteria: false,
	});

	const [posterFile, setPosterFile] = useState(null);
	const [posterPreviewUrl, setPosterPreviewUrl] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [dateError, setDateError] = useState("");

	useEffect(() => {
		const loadEvent = async () => {
			try {
				setLoading(true);
				const event = await fetchEventById(eventId);
				if (!event) throw new Error("Event not found");

				setEventDetails({
					name: event.name || "",
					description: event.description || "",
					date: event.date?.slice(0, 16) || "",
					registerBy: event.registerBy?.slice(0, 16) || "",
					type: event.type || "",
					criteria: event.criteria?.length > 0 ? event.criteria : [{ criteriaName: "", maxScore: 0 }],
					teamEvent: event.teamEvent || false,
					teamSize: event.teamSize || 1,
					department: event.department || user.department,
					hasCriteria: event.criteria?.length > 0 || false,
				});

				if (event.poster) {
					setPosterPreviewUrl(`/api/events/poster/${eventId}`);
				}
			} catch (err) {
				setError("Failed to load event details");
			} finally {
				setLoading(false);
			}
		};

		loadEvent();
	}, [eventId, fetchEventById, user.department]);

	useEffect(() => {
		const { date, registerBy } = eventDetails;
		if (date && registerBy) {
			const eventDate = new Date(date);
			const registrationDate = new Date(registerBy);
			if (registrationDate > eventDate) {
				setDateError("Registration date cannot be after the event date.");
			} else {
				setDateError("");
			}
		} else {
			setDateError("");
		}
	}, [eventDetails.date, eventDetails.registerBy]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEventDetails({ ...eventDetails, [name]: value });
	};

	const handleTeamSwitch = (_, newValue) => {
		setEventDetails((prev) => ({
			...prev,
			teamEvent: newValue,
			teamSize: newValue ? 2 : 1,
		}));
	};

	const toggleCriteria = (_, newValue) => {
		setEventDetails((prev) => ({
			...prev,
			hasCriteria: newValue,
			criteria: newValue ? [{ criteriaName: "", maxScore: 0 }] : [],
		}));
	};

	const handleCriteriaChange = (index, field, value) => {
		const updatedCriteria = [...eventDetails.criteria];
		updatedCriteria[index][field] = value;
		setEventDetails({ ...eventDetails, criteria: updatedCriteria });
	};

	const addCriteria = () => {
		setEventDetails({
			...eventDetails,
			criteria: [...eventDetails.criteria, { criteriaName: "", maxScore: 0 }],
		});
	};

	const removeCriteria = (index) => {
		const updatedCriteria = eventDetails.criteria.filter((_, i) => i !== index);
		setEventDetails({ ...eventDetails, criteria: updatedCriteria });
	};

	const handlePosterChange = (e) => {
		setPosterFile(e.target.files[0]);
	};

	const isFormValid = () => {
		const { name, description, date, registerBy, type, criteria, department, hasCriteria } = eventDetails;
		if (!name || !description || !date || !registerBy || !type || !department) return false;
		if (dateError) return false;
		if (hasCriteria) {
			if (criteria.length === 0) return false;
			return criteria.every((criterion) => criterion.criteriaName && criterion.maxScore > 0);
		}
		return true;
	};

	const handleOpenModal = () => {
		if (!isFormValid()) {
			if (dateError) {
				setError(dateError);
			} else {
				setError("Please fill in all required fields and ensure criteria (if used) are valid.");
			}
			return;
		}
		setError("");
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleConfirmUpdate = async () => {
		handleCloseModal();
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			const formData = new FormData();
			if (posterFile) {
				formData.append("poster", posterFile);
			}

			const finalEventDetails = { ...eventDetails };
			if (!finalEventDetails.hasCriteria) {
				delete finalEventDetails.criteria;
			}

			formData.append("data", JSON.stringify(finalEventDetails));

			const { success, message } = await updateEvent(eventId, formData);
			setLoading(false);

			if (!success) {
				setError(message || "Failed to update the event");
			} else {
				setSuccess("Event updated successfully! Redirecting...");
				setTimeout(() => {
					navigate(`/admin/event/${eventId}`);
				}, 1500);
			}
		} catch (err) {
			setLoading(false);
			setError(err.message || "An unexpected error occurred. Please try again later.");
		}
	};

	useEffect(() => {
		if (!posterFile) return;
		const objectUrl = URL.createObjectURL(posterFile);
		setPosterPreviewUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [posterFile]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				<CircularProgress size={60} />
			</Box>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<BackButton />
			<Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
				Update Event
			</Typography>

			<Card elevation={3} sx={{ m: 4, p: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
						Basic Information
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Event Name"
								name="name"
								value={eventDetails.name}
								onChange={handleChange}
								required
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth required>
								<InputLabel>Event Type</InputLabel>
								<Select
									name="type"
									value={eventDetails.type}
									onChange={handleChange}
									label="Event Type"
									variant="outlined"
								>
									<MenuItem value="Competition">Competition</MenuItem>
									<MenuItem value="Hackathon">Hackathon</MenuItem>
									<MenuItem value="Exhibition">Exhibition</MenuItem>
									<MenuItem value="Seminar">Seminar</MenuItem>
									<MenuItem value="Workshop">Workshop</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Description"
								name="description"
								value={eventDetails.description}
								onChange={handleChange}
								multiline
								rows={4}
								required
								variant="outlined"
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card elevation={3} sx={{ m: 4, p: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
						Event Timing
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Event Date"
								name="date"
								value={eventDetails.date}
								onChange={handleChange}
								type="datetime-local"
								required
								InputLabelProps={{ shrink: true }}
								variant="outlined"
								error={!!dateError}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Register By"
								name="registerBy"
								value={eventDetails.registerBy}
								onChange={handleChange}
								type="datetime-local"
								required
								InputLabelProps={{ shrink: true }}
								variant="outlined"
								error={!!dateError}
								helperText={dateError}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card elevation={3} sx={{ m: 4, p: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
						Event Poster
					</Typography>
					<Box
						sx={{
							border: "1px dashed",
							borderColor: "divider",
							borderRadius: 1,
							p: 3,
							textAlign: "center",
							backgroundColor: posterFile ? "action.hover" : "background.paper",
						}}
					>
						{posterPreviewUrl ? (
							<>
								<Box
									sx={{
										width: "100%",
										maxWidth: 300,
										aspectRatio: "1 / 1",
										mx: "auto",
										mb: 2,
										borderRadius: 1,
										overflow: "hidden",
									}}
								>
									<img
										src={posterPreviewUrl}
										alt="Current Poster"
										style={{ width: "100%", height: "100%", objectFit: "cover" }}
									/>
								</Box>
								<Typography variant="body1" sx={{ mb: 2 }}>
									{posterFile ? "New Poster Selected" : "Current Poster"}
								</Typography>
							</>
						) : (
							<CloudUpload sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
						)}
						<Button variant="contained" component="label" startIcon={<CloudUpload />}>
							{posterPreviewUrl ? "Change Poster" : "Upload Poster"}
							<input type="file" hidden accept="image/*" onChange={handlePosterChange} />
						</Button>
						<Typography variant="caption" display="block" sx={{ mt: 1 }}>
							Recommended size: 1080x1080px (1:1 ratio)
						</Typography>
					</Box>
				</CardContent>
			</Card>

			<Card elevation={3} sx={{ m: 4, p: 3 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
						Participation Settings
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Typography variant="body1">Team Event:</Typography>
								<ToggleButtonGroup color="primary" value={eventDetails.teamEvent} exclusive onChange={handleTeamSwitch}>
									<ToggleButton value={false}>Individual</ToggleButton>
									<ToggleButton value={true}>Team</ToggleButton>
								</ToggleButtonGroup>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Team Size"
								type="number"
								name="teamSize"
								value={eventDetails.teamSize}
								onChange={(e) =>
									setEventDetails({
										...eventDetails,
										teamSize: Math.max(2, parseInt(e.target.value) || 2),
									})
								}
								disabled={!eventDetails.teamEvent}
								variant="outlined"
								InputProps={{ inputProps: { min: 2 } }}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Card elevation={3} sx={{ m: 4, p: 3 }}>
				<CardContent>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Evaluation Criteria
						</Typography>
						<ToggleButtonGroup color="primary" value={eventDetails.hasCriteria} exclusive onChange={toggleCriteria}>
							<ToggleButton value={false}>No Criteria</ToggleButton>
							<ToggleButton value={true}>Use Criteria</ToggleButton>
						</ToggleButtonGroup>
					</Box>

					{eventDetails.hasCriteria && (
						<>
							{eventDetails.criteria.map((criterion, index) => (
								<Box key={index} sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
									<Grid container spacing={2} alignItems="center">
										<Grid item xs={12} md={6}>
											<TextField
												fullWidth
												label="Criteria Name"
												value={criterion.criteriaName}
												onChange={(e) => handleCriteriaChange(index, "criteriaName", e.target.value)}
												variant="outlined"
												required
											/>
										</Grid>
										<Grid item xs={8} md={4}>
											<TextField
												fullWidth
												label="Max Score"
												type="number"
												value={criterion.maxScore}
												onChange={(e) => handleCriteriaChange(index, "maxScore", parseInt(e.target.value) || 0)}
												variant="outlined"
												InputProps={{ inputProps: { min: 1 } }}
												required
											/>
										</Grid>
										<Grid item xs={4} md={2} sx={{ textAlign: "right" }}>
											{eventDetails.criteria.length > 1 && (
												<IconButton color="error" onClick={() => removeCriteria(index)} size="large">
													<RemoveCircleOutline />
												</IconButton>
											)}
										</Grid>
									</Grid>
								</Box>
							))}

							<Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
								<Button startIcon={<AddCircleOutline />} onClick={addCriteria} variant="outlined">
									Add Criteria
								</Button>
								{eventDetails.criteria.length > 1 && (
									<Button
										variant="outlined"
										color="error"
										onClick={() => setEventDetails({ ...eventDetails, criteria: [{ criteriaName: "", maxScore: 0 }] })}
									>
										Clear All Criteria
									</Button>
								)}
							</Box>
						</>
					)}
				</CardContent>
			</Card>

			{error && (
				<Alert severity="error" sx={{ mx: 4, mb: 3 }}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity="success" sx={{ mx: 4, mb: 3 }}>
					{success}
				</Alert>
			)}

			<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, mx: 4 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleOpenModal}
					disabled={loading || !isFormValid()}
					size="large"
					sx={{ px: 4, py: 1.5 }}
				>
					{loading ? "Please wait..." : "Review and Update Event"}
				</Button>
			</Box>

			<Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
				<DialogTitle sx={{ fontWeight: 600 }}>Confirm Event Updates</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
									Event Information
								</Typography>
								<List dense>
									<ListItem>
										<ListItemText primary="Name" secondary={eventDetails.name} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Type" secondary={eventDetails.type} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Department" secondary={eventDetails.department} />
									</ListItem>
								</List>
							</Box>

							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
									Timing
								</Typography>
								<List dense>
									<ListItem>
										<ListItemText primary="Event Date" secondary={new Date(eventDetails.date).toLocaleString()} />
									</ListItem>
									<ListItem>
										<ListItemText
											primary="Register By"
											secondary={new Date(eventDetails.registerBy).toLocaleString()}
										/>
									</ListItem>
								</List>
							</Box>

							<Box>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
									Participation
								</Typography>
								<List dense>
									<ListItem>
										<ListItemText
											primary="Type"
											secondary={eventDetails.teamEvent ? `Team (Size: ${eventDetails.teamSize})` : "Individual"}
										/>
									</ListItem>
								</List>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							{posterPreviewUrl && (
								<Box sx={{ mb: 3 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
										{posterFile ? "New Poster Preview" : "Current Poster"}
									</Typography>
									<Box
										sx={{
											width: "100%",
											aspectRatio: "1 / 1",
											border: 1,
											borderColor: "divider",
											borderRadius: 1.5,
											overflow: "hidden",
											backgroundColor: "rgba(0,0,0,0.05)",
										}}
									>
										<img
											src={posterPreviewUrl}
											alt="Poster Preview"
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									</Box>
								</Box>
							)}
							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
									Description
								</Typography>
								<Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
									<Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
										{eventDetails.description}
									</Typography>
								</Box>
							</Box>

							{eventDetails.hasCriteria && eventDetails.criteria.length > 0 && (
								<Box>
									<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
										Evaluation Criteria
									</Typography>
									<List dense>
										{eventDetails.criteria.map((c, i) => (
											<ListItem key={i}>
												<ListItemText primary={c.criteriaName} secondary={`Max Score: ${c.maxScore}`} />
											</ListItem>
										))}
									</List>
								</Box>
							)}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions sx={{ p: 3 }}>
					<Button onClick={handleCloseModal} color="secondary" variant="outlined" sx={{ mr: 2 }}>
						Cancel
					</Button>
					<Button onClick={handleConfirmUpdate} color="primary" variant="contained" disabled={loading}>
						{loading ? "Updating..." : "Confirm Updates"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default EventUpdatePage;
