// import { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
// 	Card,
// 	CardContent,
// 	Typography,
// 	Grid,
// 	Button,
// 	Dialog,
// 	DialogActions,
// 	DialogContent,
// 	DialogContentText,
// 	DialogTitle,
// 	Chip,
// } from "@mui/material";
// import { useTeacherStore } from "../../store/teacher";
// import { useEventStore } from "../../store/event";
// import { AuthContext } from "../../context/AuthContext";

// const TeacherDashboard = () => {
// 	const { findTeacher, fetchEvaluationRecord, fetchTeacherCreationRecord } = useTeacherStore();
// 	const { updateEventStatus } = useEventStore();
// 	const { user } = useContext(AuthContext);
// 	const [teacher, setTeacher] = useState(null);
// 	const [evaluationRecords, setEvaluationRecords] = useState([]);
// 	const [createdEvents, setCreatedEvents] = useState([]);
// 	const [openModal, setOpenModal] = useState(false);
// 	const [selectedEvent, setSelectedEvent] = useState(null);
// 	const [nextStatus, setNextStatus] = useState("");
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const loadTeacher = async () => {
// 			try {
// 				const response = await findTeacher(user.email);
// 				if (response.success) {
// 					setTeacher(response.data);
// 					const evaluations = await fetchEvaluationRecord(response.data._id);
// 					const created = await fetchTeacherCreationRecord(response.data._id);

// 					if (evaluations) setEvaluationRecords(evaluations);
// 					if (created) setCreatedEvents(created);
// 				} else {
// 					console.error(response.message);
// 				}
// 			} catch (error) {
// 				console.error("Failed to load teacher data:", error);
// 			}
// 		};

// 		loadTeacher();
// 	}, [user.email]);

// 	const handleStatusChange = (event) => {
// 		const current = event.status.toLowerCase();
// 		const next = statusOrder[current];

// 		if (!next) return;
// 		setSelectedEvent(event);
// 		setNextStatus(next);
// 		setOpenModal(true);
// 	};

// 	const confirmStatusChange = async () => {
// 		if (!selectedEvent || !nextStatus) return;

// 		await updateEventStatus(selectedEvent._id, nextStatus);

// 		setCreatedEvents((prevEvents) =>
// 			prevEvents.map((ev) => (ev._id === selectedEvent._id ? { ...ev, status: nextStatus } : ev))
// 		);

// 		setOpenModal(false);
// 	};

// 	const handleDoubleClick = (eventId) => {
// 		console.log("Double-clicked on event ID:", eventId);
// 		navigate(`event/${eventId}`);
// 	};

// 	const getStatusColor = (status) => {
// 		switch (status.toLowerCase()) {
// 			case "pending":
// 				return "warning";
// 			case "open":
// 				return "info";
// 			case "ongoing":
// 				return "success";
// 			case "completed":
// 				return "default";
// 			default:
// 				return "default";
// 		}
// 	};

// 	return (
// 		<div>
// 			{/* Teacher Info */}
// 			<Card sx={{ mb: 3 }}>
// 				<CardContent>
// 					<Typography variant="h5">{teacher?.name}</Typography>
// 					<Typography>Email: {teacher?.email}</Typography>
// 				</CardContent>
// 			</Card>

// 			{/* Created Events */}
// 			<Typography variant="h6" gutterBottom>
// 				Created Events
// 			</Typography>
// 			<Grid container spacing={2}>
// 				{createdEvents.map((event) => (
// 					<Grid item xs={12} sm={6} md={4} key={event._id}>
// 						<Card
// 							sx={{
// 								p: 2,
// 								borderRadius: 2,
// 								border: event.status === "pending" ? "2px solid red" : "1px solid rgba(0,0,0,0.1)",
// 								backgroundColor: event.status === "pending" ? "#fff4f4" : "white",
// 								transition: "transform 0.3s ease, box-shadow 0.3s ease",
// 								"&:hover": { transform: "scale(1.01)", boxShadow: 8 },
// 							}}
// 							onDoubleClick={() => handleDoubleClick(event._id)}
// 						>
// 							<CardContent>
// 								<Typography variant="h6" fontWeight={600}>
// 									{event.name}
// 								</Typography>
// 								<Typography variant="body2" color="text.secondary">
// 									Type: {event.type}
// 								</Typography>
// 								<Typography variant="body2" color="text.secondary">
// 									Participants: {event.participantCount}
// 								</Typography>
// 								<Typography variant="body2" sx={{ mt: 1 }}>
// 									Status: <Chip label={event.status} color={getStatusColor(event.status)} size="small" />
// 								</Typography>

// 								{/* Action Button */}
// 								{["open", "ongoing"].includes(event.status.toLowerCase()) && (
// 									<Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleStatusChange(event)}>
// 										Set to {event.status.toLowerCase() === "open" ? "Ongoing" : "Completed"}
// 									</Button>
// 								)}
// 							</CardContent>
// 						</Card>
// 					</Grid>
// 				))}
// 			</Grid>

// 			{/* Evaluation Record */}
// 			<Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
// 				Evaluation Record
// 			</Typography>
// 			<Grid container spacing={2}>
// 				{evaluationRecords.map((record) => (
// 					<Grid item xs={12} sm={6} md={4} key={record._id}>
// 						<Card sx={{ p: 2, borderRadius: 2 }}>
// 							<CardContent>
// 								<Typography variant="h6">{record.eventId?.name}</Typography>
// 								<Typography variant="body2" color="text.secondary">
// 									Type: {record.eventId?.type}
// 								</Typography>
// 								<Typography variant="body2" color="text.secondary">
// 									Participant Count: {record.eventId?.participantCount}
// 								</Typography>
// 								<Button
// 									variant="contained"
// 									color="primary"
// 									component={Link}
// 									to={`/teacher/${teacher?._id}/score-participants/${record.eventId?._id}`}
// 								>
// 									Score Participants
// 								</Button>
// 							</CardContent>
// 						</Card>
// 					</Grid>
// 				))}
// 			</Grid>

// 			{/* Confirmation Dialog */}
// 			<Dialog open={openModal} onClose={() => setOpenModal(false)}>
// 				<DialogTitle>Confirm Status Change</DialogTitle>
// 				<DialogContent>
// 					<DialogContentText>
// 						Are you sure you want to change the status of <strong>{selectedEvent?.name}</strong> to{" "}
// 						<strong>{nextStatus}</strong>?
// 					</DialogContentText>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={() => setOpenModal(false)}>Cancel</Button>
// 					<Button onClick={confirmStatusChange} color="primary" autoFocus>
// 						Confirm
// 					</Button>
// 				</DialogActions>
// 			</Dialog>
// 		</div>
// 	);
// };

// export default TeacherDashboard;

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Chip,
	Tabs,
	Tab,
	Box,
} from "@mui/material";
import { useTeacherStore } from "../../store/teacher";
import { useEventStore } from "../../store/event";
import { AuthContext } from "../../context/AuthContext";

const statusOrder = {
	pending: "open",
	open: "ongoing",
	ongoing: "completed",
};

const TeacherDashboard = () => {
	const { findTeacher, fetchEvaluationRecord, fetchTeacherCreationRecord } = useTeacherStore();
	const { updateEventStatus } = useEventStore();
	const { user } = useContext(AuthContext);
	const [teacher, setTeacher] = useState(null);
	const [evaluationRecords, setEvaluationRecords] = useState([]);
	const [createdEvents, setCreatedEvents] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [nextStatus, setNextStatus] = useState("");
	const [activeTab, setActiveTab] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const loadTeacher = async () => {
			try {
				const response = await findTeacher(user.email);
				if (response.success) {
					setTeacher(response.data);
					const evaluations = await fetchEvaluationRecord(response.data._id);
					const created = await fetchTeacherCreationRecord(response.data._id);

					if (evaluations) setEvaluationRecords(evaluations);
					if (created) setCreatedEvents(created);
				} else {
					console.error(response.message);
				}
			} catch (error) {
				console.error("Failed to load teacher data:", error);
			}
		};

		loadTeacher();
	}, [user.email]);

	const handleStatusChange = (event) => {
		const current = event.status.toLowerCase();
		const next = statusOrder[current];

		if (!next) return;
		setSelectedEvent(event);
		setNextStatus(next);
		setOpenModal(true);
	};

	const confirmStatusChange = async () => {
		if (!selectedEvent || !nextStatus) return;

		await updateEventStatus(selectedEvent._id, nextStatus);

		setCreatedEvents((prevEvents) =>
			prevEvents.map((ev) => (ev._id === selectedEvent._id ? { ...ev, status: nextStatus } : ev))
		);

		setOpenModal(false);
	};

	const handleDoubleClick = (eventId) => {
		navigate(`event/${eventId}`);
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "pending":
				return "warning";
			case "open":
				return "info";
			case "ongoing":
				return "success";
			case "completed":
				return "default";
			default:
				return "default";
		}
	};

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	return (
		<div>
			{/* Teacher Info */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h5">{teacher?.name}</Typography>
					<Typography>Email: {teacher?.email}</Typography>
				</CardContent>
			</Card>

			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: "white", mb: 2, color: "white" }}>
				<Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" textColor="inherit">
					<Tab
						label="Created Events"
						sx={{
							...(activeTab === 0 && { backgroundColor: "rgba(255, 255, 255, 0.1)" }),
						}}
					/>
					<Tab
						label="Evaluation Work"
						sx={{
							...(activeTab === 1 && { backgroundColor: "rgba(255, 255, 255, 0.1)" }),
						}}
					/>
				</Tabs>
			</Box>

			{/* Created Events Tab */}
			{activeTab === 0 && (
				<Grid container spacing={2}>
					{createdEvents.map((event) => (
						<Grid item xs={12} sm={6} md={4} key={event._id}>
							<Card
								sx={{
									p: 2,
									borderRadius: 2,
									border: event.status === "pending" ? "2px solid red" : "1px solid rgba(0,0,0,0.1)",
									backgroundColor: event.status === "pending" ? "#fff4f4" : "white",
									transition: "transform 0.3s ease, box-shadow 0.3s ease",
									"&:hover": { transform: "scale(1.01)", boxShadow: 8 },
								}}
								onDoubleClick={() => handleDoubleClick(event._id)}
							>
								<CardContent>
									<Typography variant="h6" fontWeight={600}>
										{event.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Type: {event.type}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Participants: {event.participantCount}
									</Typography>
									<Typography variant="body2" sx={{ mt: 1 }}>
										Status: <Chip label={event.status} color={getStatusColor(event.status)} size="small" />
									</Typography>

									{["open", "ongoing"].includes(event.status.toLowerCase()) && (
										<Button
											variant="contained"
											color="primary"
											sx={{ mt: 2 }}
											onClick={() => handleStatusChange(event)}
										>
											Set to {event.status.toLowerCase() === "open" ? "Ongoing" : "Completed"}
										</Button>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			{/* Evaluation Record Tab */}
			{activeTab === 1 && (
				<Grid container spacing={2}>
					{evaluationRecords.map((record) => (
						<Grid item xs={12} sm={6} md={4} key={record._id}>
							<Card sx={{ p: 2, borderRadius: 2 }}>
								<CardContent>
									<Typography variant="h6">{record.eventId?.name}</Typography>
									<Typography variant="body2" color="text.secondary">
										Type: {record.eventId?.type}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Participant Count: {record.eventId?.participantCount}
									</Typography>
									<Button
										variant="contained"
										color="primary"
										component={Link}
										to={`/teacher/${teacher?._id}/score-participants/${record.eventId?._id}`}
										sx={{ mt: 2 }}
									>
										Score Participants
									</Button>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			{/* Confirmation Dialog */}
			<Dialog open={openModal} onClose={() => setOpenModal(false)}>
				<DialogTitle>Confirm Status Change</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to change the status of <strong>{selectedEvent?.name}</strong> to{" "}
						<strong>{nextStatus}</strong>?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenModal(false)}>Cancel</Button>
					<Button onClick={confirmStatusChange} color="primary" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default TeacherDashboard;
