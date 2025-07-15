import React, { useState, useContext, useEffect } from "react";
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
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, CloudUpload } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useEventStore } from "../../store/event.js";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../store/admin.js";
import { useTeacherStore } from "../../store/teacher.js";
import BackButton from "../../components/BackButton.jsx";

const EventCreatePage = () => {
	const navigate = useNavigate();
	const { findAdmin } = useAdminStore();
	const { findTeacher } = useTeacherStore();
	const { user, role } = useContext(AuthContext);
	const { createEventWithPoster } = useEventStore();

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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [dateError, setDateError] = useState(""); // NEW: State for date validation error

	// NEW: useEffect for real-time date validation
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

	const handleTeamSwitch = () => {
		setEventDetails((prev) => ({
			...prev,
			teamEvent: !prev.teamEvent,
			teamSize: !prev.teamEvent ? 2 : 1,
		}));
	};

	const toggleCriteria = () => {
		setEventDetails((prev) => ({
			...prev,
			hasCriteria: !prev.hasCriteria,
			criteria: !prev.hasCriteria ? [{ criteriaName: "", maxScore: 0 }] : [],
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

	// MODIFIED: Added dateError check
	const isFormValid = () => {
		const { name, description, date, registerBy, type, criteria, department, hasCriteria } = eventDetails;
		if (!name || !description || !date || !registerBy || !type || !department) return false;

		// Ensure there are no date errors
		if (dateError) return false;

		if (hasCriteria) {
			if (criteria.length === 0) return false;
			return criteria.every((criterion) => criterion.criteriaName && criterion.maxScore > 0);
		}
		return true;
	};

	// MODIFIED: Updated validation messages
	const handleOpenModal = () => {
		if (!isFormValid()) {
			if (dateError) {
				setError(dateError); // Show specific date error if it exists
			} else {
				setError("Please fill in all required fields and ensure criteria (if used) are valid.");
			}
			return;
		}
		if (!posterFile) {
			setError("Please upload a poster for the event.");
			return;
		}
		setError(""); // Clear general error if form is valid
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleConfirmCreate = async () => {
		handleCloseModal();
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			let createdBy = null;
			let createdByModel = "";

			if (role === "admin") {
				const response = await findAdmin(user.email);
				if (!response.success) throw new Error("Admin not found");
				createdBy = response.data._id;
				createdByModel = "Admin";
			} else if (role === "teacher") {
				const response = await findTeacher(user.email);
				if (!response.success) throw new Error("Teacher not found");
				createdBy = response.data._id;
				createdByModel = "Teacher";
			}

			const finalEventDetails = { ...eventDetails };
			if (!finalEventDetails.hasCriteria) {
				delete finalEventDetails.criteria;
			}

			const formData = new FormData();
			formData.append("poster", posterFile);
			formData.append("data", JSON.stringify({ ...finalEventDetails, createdBy, createdByModel }));

			const { success, message } = await createEventWithPoster(formData);
			setLoading(false);

			if (!success) {
				setError(message || "Failed to create the event. Please try again.");
			} else {
				setSuccess("Event created successfully! Redirecting...");
				setTimeout(() => {
					navigate(role === "admin" ? "/admin" : "/teacher");
				}, 1500);
			}
		} catch (err) {
			setLoading(false);
			setError(err.message || "An unexpected error occurred. Please try again later.");
		}
	};

	useEffect(() => {
		if (!posterFile) {
			setPosterPreviewUrl(null);
			return;
		}
		const objectUrl = URL.createObjectURL(posterFile);
		setPosterPreviewUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [posterFile]);

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<BackButton />
			<Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
				Create New Event
			</Typography>

			{/* ... Other Cards ... */}
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
								// MODIFIED: Added error props
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
								// MODIFIED: Added error props for UI feedback
								error={!!dateError}
								helperText={dateError}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* ... Other Cards ... */}
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
							bgcolor: posterFile ? "action.hover" : "background.paper",
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
										alt="Selected Poster"
										style={{ width: "100%", height: "100%", objectFit: "cover" }}
									/>
								</Box>
								<Typography variant="body1" sx={{ mb: 2 }}>
									Selected: {posterFile.name}
								</Typography>
							</>
						) : (
							<CloudUpload sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
						)}
						<Button variant="contained" component="label" startIcon={<CloudUpload />}>
							{posterPreviewUrl ? "Change Poster" : "Upload Poster"}
							<input type="file" hidden accept="image/*" onChange={handlePosterChange} required />
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
								onChange={(e) => setEventDetails({ ...eventDetails, teamSize: parseInt(e.target.value) || 1 })}
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
					{loading ? "Please wait..." : "Review and Create Event"}
				</Button>
			</Box>

			{/* ... Dialog ... */}
			<Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
				<DialogTitle sx={{ fontWeight: 600 }}>Confirm Event Details</DialogTitle>
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
										<ListItemText primary="Department" secondary={`By ${eventDetails.department}`} />
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
										Poster Preview
									</Typography>
									<Box
										sx={{
											width: "100%",
											aspectRatio: "1 / 1", // Enforce the 1:1 aspect ratio
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
												objectFit: "cover", // to match the backend aspect ratio
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
					<Button onClick={handleConfirmCreate} color="primary" variant="contained" disabled={loading}>
						{loading ? "Creating..." : "Confirm & Create Event"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default EventCreatePage;
