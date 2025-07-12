// import { useState, useEffect, useContext } from "react";
// import { Box, Button, Modal, Typography, TextField, Select, MenuItem, Chip, CircularProgress } from "@mui/material";
// import { useEventStore } from "../store/event.js";
// import { useStudentStore } from "../store/student";
// import { useParticipantStore } from "../store/participant.js";
// import { AuthContext } from "../context/AuthContext.jsx";

// const RegistrationConfirmationModal = ({ event, eventId, eventTeam, teamSize, onClose, onSuccess }) => {
// 	const { fetchAvailableStudents } = useEventStore();
// 	const { createParticipant } = useParticipantStore();
// 	const { findStudent } = useStudentStore();

// 	const { user } = useContext(AuthContext);
// 	const [student, setStudent] = useState(null);
// 	const [availableStudents, setAvailableStudents] = useState([]);
// 	const [selectedMembers, setSelectedMembers] = useState([]);
// 	const [teamName, setTeamName] = useState("");
// 	const [loading, setLoading] = useState(true);
// 	const [registering, setRegistering] = useState(false);
// 	const [error, setError] = useState("");

// 	// Fetch logged-in student
// 	useEffect(() => {
// 		const loadStudent = async () => {
// 			try {
// 				const response = await findStudent(user.email);
// 				if (response.success) {
// 					const studentData = response.data;
// 					setStudent(studentData);
// 					setSelectedMembers([studentData]); // always include the student
// 				}
// 			} catch (err) {
// 				console.error("Failed to load student:", err);
// 				setError("Could not fetch your student data.");
// 			}
// 		};
// 		loadStudent();
// 	}, [user.email]);

// 	// Load available students for team selection
// 	useEffect(() => {
// 		if (!eventTeam) {
// 			setLoading(false);
// 			return;
// 		}

// 		const loadAvailableStudents = async () => {
// 			try {
// 				const students = await fetchAvailableStudents(eventId);
// 				setAvailableStudents(students);
// 			} catch (err) {
// 				setError("Failed to load available students.");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		loadAvailableStudents();
// 	}, [eventTeam, eventId]);

// 	const maxSelectable = teamSize - 1;

// 	const handleAddMember = (newMemberId) => {
// 		if (selectedMembers.length - 1 >= maxSelectable) return;

// 		const newMember = availableStudents.find((s) => s._id === newMemberId);
// 		if (newMember && !selectedMembers.some((m) => m._id === newMember._id)) {
// 			setSelectedMembers([...selectedMembers, newMember]);
// 		}
// 	};

// 	const handleRemoveMember = (memberId) => {
// 		if (student && memberId === student._id) return; // cannot remove self
// 		setSelectedMembers(selectedMembers.filter((m) => m._id !== memberId));
// 	};

// 	const handleRegister = async () => {
// 		setRegistering(true);
// 		try {
// 			let payload = { eventId };

// 			if (eventTeam) {
// 				payload = {
// 					...payload,
// 					teamName,
// 					members: selectedMembers.map((m) => m._id),
// 				};
// 			} else {
// 				payload = {
// 					...payload,
// 					student: student._id,
// 					members: [],
// 				};
// 			}

// 			const response = await createParticipant(payload);
// 			if (response.success) {
// 				onSuccess();
// 				onClose();
// 			} else {
// 				setError(response.message || "Registration failed.");
// 			}
// 		} catch (err) {
// 			console.error("Registration failed:", err);
// 			setError("Something went wrong.");
// 		} finally {
// 			setRegistering(false);
// 		}
// 	};

// 	return (
// 		<Modal open onClose={onClose}>
// 			<Box p={3} bgcolor="white" m="auto" mt={10} width={400} borderRadius={2}>
// 				<Typography variant="h6" gutterBottom>
// 					Confirm Registration
// 				</Typography>

// 				{loading ? (
// 					<CircularProgress />
// 				) : error ? (
// 					<Typography color="error">{error}</Typography>
// 				) : eventTeam === false ? (
// 					<Typography mt={2}>Do you want to register for this event as an individual?</Typography>
// 				) : (
// 					<>
// 						<TextField
// 							label="Team Name"
// 							variant="outlined"
// 							fullWidth
// 							value={teamName}
// 							onChange={(e) => setTeamName(e.target.value)}
// 							margin="dense"
// 						/>

// 						<Select
// 							fullWidth
// 							value=""
// 							onChange={(e) => handleAddMember(e.target.value)}
// 							displayEmpty
// 							sx={{ mt: 2 }}
// 							disabled={selectedMembers.length - 1 >= maxSelectable}
// 						>
// 							<MenuItem value="" disabled>
// 								{selectedMembers.length - 1 >= maxSelectable ? "Team member limit reached" : "Select Team Members"}
// 							</MenuItem>
// 							{availableStudents
// 								.filter((s) => !selectedMembers.some((m) => m._id === s._id))
// 								.map((student) => (
// 									<MenuItem key={student._id} value={student._id}>
// 										{student.name} ({student.usn})
// 									</MenuItem>
// 								))}
// 						</Select>

// 						<Box mt={2}>
// 							{selectedMembers.map((member) => (
// 								<Chip
// 									key={member._id}
// 									label={`${member.name} (${member.usn})`}
// 									onDelete={member._id === student?._id ? undefined : () => handleRemoveMember(member._id)}
// 									size="small"
// 									sx={{ mr: 1, mb: 1 }}
// 								/>
// 							))}
// 						</Box>
// 						<Typography variant="caption" color="textSecondary">
// 							{selectedMembers.length} / {teamSize} members selected
// 						</Typography>
// 					</>
// 				)}

// 				<Box mt={2} display="flex" justifyContent="space-between">
// 					<Button onClick={onClose}>Cancel</Button>
// 					<Button
// 						variant="contained"
// 						onClick={handleRegister}
// 						disabled={
// 							registering ||
// 							(eventTeam && (!teamName || selectedMembers.length !== teamSize)) ||
// 							(!eventTeam && !student)
// 						}
// 					>
// 						{registering ? "Registering..." : "Confirm"}
// 					</Button>
// 				</Box>
// 			</Box>
// 		</Modal>
// 	);
// };

// export default RegistrationConfirmationModal;

import { useState, useEffect, useContext } from "react";
import {
	Box,
	Button,
	Modal,
	Typography,
	TextField,
	Select,
	MenuItem,
	Chip,
	CircularProgress,
	Divider,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { useEventStore } from "../store/event.js";
import { useStudentStore } from "../store/student";
import { useParticipantStore } from "../store/participant.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { formatDateForInput } from "../utils/dateFormat.jsx";

const RegistrationConfirmationModal = ({ event, eventId, eventTeam, teamSize, onClose, onSuccess }) => {
	const { fetchAvailableStudents } = useEventStore();
	const { createParticipant } = useParticipantStore();
	const { findStudent } = useStudentStore();

	const { user } = useContext(AuthContext);
	const [student, setStudent] = useState(null);
	const [availableStudents, setAvailableStudents] = useState([]);
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [teamName, setTeamName] = useState("");
	const [loading, setLoading] = useState(true);
	const [registering, setRegistering] = useState(false);
	const [error, setError] = useState("");

	// Format date for display
	const formatDate = (dateString) => {
		return dateString ? formatDateForInput(new Date(dateString), "PPPpp") : "Not specified";
	};

	// Fetch logged-in student
	useEffect(() => {
		const loadStudent = async () => {
			try {
				const response = await findStudent(user.email);
				if (response.success) {
					const studentData = response.data;
					setStudent(studentData);
					setSelectedMembers([studentData]); // always include the student
				}
			} catch (err) {
				console.error("Failed to load student:", err);
				setError("Could not fetch your student data.");
			}
		};
		loadStudent();
	}, [user.email]);

	// Load available students for team selection
	useEffect(() => {
		if (!eventTeam) {
			setLoading(false);
			return;
		}

		const loadAvailableStudents = async () => {
			try {
				const students = await fetchAvailableStudents(eventId);
				setAvailableStudents(students);
			} catch (err) {
				setError("Failed to load available students.");
			} finally {
				setLoading(false);
			}
		};

		loadAvailableStudents();
	}, [eventTeam, eventId]);

	const maxSelectable = teamSize - 1;

	const handleAddMember = (newMemberId) => {
		if (selectedMembers.length - 1 >= maxSelectable) return;

		const newMember = availableStudents.find((s) => s._id === newMemberId);
		if (newMember && !selectedMembers.some((m) => m._id === newMember._id)) {
			setSelectedMembers([...selectedMembers, newMember]);
		}
	};

	const handleRemoveMember = (memberId) => {
		if (student && memberId === student._id) return; // cannot remove self
		setSelectedMembers(selectedMembers.filter((m) => m._id !== memberId));
	};

	const handleRegister = async () => {
		setRegistering(true);
		try {
			let payload = { eventId };

			if (eventTeam) {
				payload = {
					...payload,
					teamName,
					members: selectedMembers.map((m) => m._id),
				};
			} else {
				payload = {
					...payload,
					student: student._id,
					members: [],
				};
			}

			const response = await createParticipant(payload);
			if (response.success) {
				onSuccess();
				onClose();
			} else {
				setError(response.message || "Registration failed.");
			}
		} catch (err) {
			console.error("Registration failed:", err);
			setError("Something went wrong.");
		} finally {
			setRegistering(false);
		}
	};

	return (
		<Modal open onClose={onClose}>
			<Box p={3} bgcolor="white" m="auto" mt={10} maxWidth={600} borderRadius={2}>
				<Typography variant="h5" gutterBottom>
					Confirm Registration for {event.name}
				</Typography>

				{/* Event Details Section */}
				<Box mb={3}>
					<Typography variant="subtitle1" gutterBottom>
						Event Details
					</Typography>
					<Divider />
					<List dense>
						<ListItem>
							<ListItemText primary={event.description || "Not provided"} />
						</ListItem>
						<ListItem>
							<ListItemText primary="Type" secondary={event.type || "Not specified"} />
						</ListItem>
						<ListItem>
							<ListItemText primary="Date" secondary={formatDate(event.date)} />
						</ListItem>
						<ListItem>
							<ListItemText primary="Registration Deadline" secondary={formatDate(event.registerBy)} />
						</ListItem>
						{event.department && (
							<ListItem>
								<ListItemText primary="Department" secondary={event.department} />
							</ListItem>
						)}
					</List>
				</Box>

				{loading ? (
					<CircularProgress />
				) : error ? (
					<Typography color="error">{error}</Typography>
				) : eventTeam === false ? (
					<>
						<Typography variant="subtitle1" gutterBottom>
							Individual Registration
						</Typography>
						<Divider />
						<Typography mt={2}>You are registering for this event as an individual participant.</Typography>
					</>
				) : (
					<>
						<Typography variant="subtitle1" gutterBottom>
							Team Registration
						</Typography>
						<Divider />
						<Typography mt={2}>Please provide your team details below ({teamSize} members required):</Typography>

						<TextField
							label="Team Name"
							variant="outlined"
							fullWidth
							value={teamName}
							onChange={(e) => setTeamName(e.target.value)}
							margin="dense"
							sx={{ mt: 2 }}
							required
						/>

						<Select
							fullWidth
							value=""
							onChange={(e) => handleAddMember(e.target.value)}
							displayEmpty
							sx={{ mt: 2 }}
							disabled={selectedMembers.length - 1 >= maxSelectable}
						>
							<MenuItem value="" disabled>
								{selectedMembers.length - 1 >= maxSelectable ? "Team member limit reached" : "Select Team Members"}
							</MenuItem>
							{availableStudents
								.filter((s) => !selectedMembers.some((m) => m._id === s._id))
								.map((student) => (
									<MenuItem key={student._id} value={student._id}>
										{student.name} ({student.usn})
									</MenuItem>
								))}
						</Select>

						<Box mt={2}>
							<Typography variant="subtitle2">Selected Team Members:</Typography>
							{selectedMembers.map((member) => (
								<Chip
									key={member._id}
									label={`${member.name} (${member.usn})`}
									onDelete={member._id === student?._id ? undefined : () => handleRemoveMember(member._id)}
									size="small"
									sx={{ mr: 1, mb: 1 }}
								/>
							))}
						</Box>
						<Typography
							variant="caption"
							color={selectedMembers.length === teamSize ? "success.main" : "textSecondary"}
						>
							{selectedMembers.length} / {teamSize} members selected
						</Typography>
					</>
				)}

				<Box mt={4} display="flex" justifyContent="space-between">
					<Button onClick={onClose} variant="outlined">
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleRegister}
						disabled={
							registering ||
							(eventTeam && (!teamName || selectedMembers.length !== teamSize)) ||
							(!eventTeam && !student)
						}
					>
						{registering ? <CircularProgress size={24} /> : "Confirm Registration"}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default RegistrationConfirmationModal;
