// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Paper,
// 	Box,
// 	Button,
// 	Typography,
// } from "@mui/material";
// import { useParticipantStore } from "../../store/participant.js";
// import { useScoreStore } from "../../store/score.js";
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import ScoreEntryModal from "./ScoreEntryModal.jsx";
// import { useTeacherStore } from "../../store/teacher.js";
// import { useEvaluatorStore } from "../../store/evaluator.js";
// import BackButton from "../../components/BackButton.jsx";

// const ScoreParticipants = () => {
// 	const { teacherId, eventId } = useParams();
// 	const { fetchParticipantsByEvent } = useParticipantStore();
// 	const { fetchTeacherEvaluatorId } = useTeacherStore();
// 	const { fetchAllScoresByEvent } = useScoreStore();
// 	const { fetchAssignedStudents } = useEvaluatorStore();

// 	const [loading, setLoading] = useState(true);
// 	const [allParticipants, setAllParticipants] = useState([]);
// 	const [assignedParticipants, setAssignedParticipants] = useState(null);
// 	const [scores, setScores] = useState({});
// 	const [selectedParticipantId, setSelectedParticipantId] = useState("");
// 	const [selectedParticipantName, setSelectedParticipantName] = useState("");
// 	const [evaluatorId, setEvaluatorId] = useState("");
// 	const [open, setOpen] = useState(false);

// 	const handleOpen = () => setOpen(true);

// 	const handleClose = async () => {
// 		setOpen(false);
// 		try {
// 			const updatedScores = await fetchAllScoresByEvent(eventId);
// 			if (updatedScores && Array.isArray(updatedScores)) {
// 				const computedScores = updatedScores.reduce((acc, scoreEntry) => {
// 					const totalScore = scoreEntry.scores.reduce((sum, s) => sum + s.scoreValue, 0);
// 					acc[scoreEntry.participantId._id] = totalScore;
// 					return acc;
// 				}, {});

// 				setScores(computedScores);
// 			}
// 		} catch (error) {
// 			console.error("Error updating scores:", error);
// 		}
// 	};

// 	useEffect(() => {
// 		const loadData = async () => {
// 			try {
// 				const participantListData = await fetchParticipantsByEvent(eventId);
// 				if (participantListData) {
// 					setAllParticipants(participantListData);
// 				}

// 				const teacherEvaluatorId = await fetchTeacherEvaluatorId(teacherId, eventId);
// 				if (teacherEvaluatorId) {
// 					setEvaluatorId(teacherEvaluatorId.data);
// 				}

// 				const evaluatorStudents = await fetchAssignedStudents(teacherEvaluatorId.data);
// 				if (evaluatorStudents) {
// 					setAssignedParticipants(evaluatorStudents || []);
// 				}

// 				const scoreData = await fetchAllScoresByEvent(eventId);
// 				if (scoreData && Array.isArray(scoreData)) {
// 					const computedScores = scoreData.reduce((acc, scoreEntry) => {
// 						const totalScore = scoreEntry.scores.reduce((sum, s) => sum + s.scoreValue, 0);
// 						acc[scoreEntry.participantId._id] = totalScore;
// 						return acc;
// 					}, {});
// 					setScores(computedScores);
// 				} else {
// 					setScores({});
// 				}

// 				setLoading(false);
// 			} catch (error) {
// 				console.error("Failed to load event data.");
// 			}
// 		};
// 		loadData();
// 	}, [teacherId, eventId, fetchParticipantsByEvent, fetchAssignedStudents, fetchAllScoresByEvent]);

// 	return (
// 		!loading && (
// 			<Box>
// 				<BackButton />
// 				<Typography variant="h6" gutterBottom>
// 					Assigned Participants
// 				</Typography>
// 				<TableContainer component={Paper} sx={{ mb: 3 }}>
// 					<Table>
// 						<TableHead>
// 							<TableRow>
// 								<TableCell>Participant Name</TableCell>
// 								<TableCell>Score</TableCell>
// 								<TableCell>Action</TableCell>
// 							</TableRow>
// 						</TableHead>
// 						{assignedParticipants ? (
// 							<TableBody>
// 								{assignedParticipants.map((participant) => {
// 									const isScored = scores.hasOwnProperty(participant._id);
// 									console.log(scores[participant._id]);
// 									return (
// 										<TableRow key={participant._id}>
// 											<TableCell>{participant.student?.name || participant.teamName || "Unknown"}</TableCell>
// 											<TableCell>{scores[participant._id] ?? "No score"}</TableCell>
// 											<TableCell>
// 												<Button
// 													disabled={isScored}
// 													variant="contained"
// 													color="primary"
// 													onClick={() => {
// 														setSelectedParticipantId(participant._id);
// 														setSelectedParticipantName(participant.teamName || participant.student?.name);
// 														handleOpen();
// 													}}
// 												>
// 													Add Score
// 												</Button>
// 											</TableCell>
// 										</TableRow>
// 									);
// 								})}
// 							</TableBody>
// 						) : (
// 							<Typography>Couldn't fetch participants</Typography>
// 						)}
// 					</Table>
// 				</TableContainer>

// 				<Typography variant="h6" gutterBottom>
// 					All Participants
// 				</Typography>
// 				<TableContainer component={Paper}>
// 					<Table>
// 						<TableHead>
// 							<TableRow>
// 								<TableCell>Participant Name</TableCell>
// 							</TableRow>
// 						</TableHead>
// 						<TableBody>
// 							{allParticipants.map((participant) => (
// 								<TableRow key={participant._id}>
// 									<TableCell>{participant.student?.name || participant.teamName || "Unknown"}</TableCell>
// 								</TableRow>
// 							))}
// 						</TableBody>
// 					</Table>
// 				</TableContainer>

// 				{open && selectedParticipantId && (
// 					<ScoreEntryModal
// 						eventId={eventId}
// 						participantId={selectedParticipantId}
// 						participantName={selectedParticipantName}
// 						evaluatorId={evaluatorId}
// 						onClose={handleClose}
// 					/>
// 				)}
// 			</Box>
// 		)
// 	);
// };

// export default ScoreParticipants;

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Button,
	Typography,
	Chip,
	Avatar,
	Divider,
	Stack,
	Card,
	CardContent,
	Grid,
	CircularProgress,
	Tooltip,
} from "@mui/material";
import { useParticipantStore } from "../../store/participant.js";
import { useScoreStore } from "../../store/score.js";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ScoreEntryModal from "./ScoreEntryModal.jsx";
import { useTeacherStore } from "../../store/teacher.js";
import { useEvaluatorStore } from "../../store/evaluator.js";
import { useEventStore } from "../../store/event.js";
import BackButton from "../../components/BackButton.jsx";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ScoreIcon from "@mui/icons-material/Score";
import InfoIcon from "@mui/icons-material/Info";

const ScoreParticipants = () => {
	const { teacherId, eventId } = useParams();
	const { fetchParticipantsByEvent } = useParticipantStore();
	const { fetchTeacherEvaluatorId } = useTeacherStore();
	const { fetchAllScoresByEvent } = useScoreStore();
	const { fetchAssignedStudents } = useEvaluatorStore();
	const { fetchEventById } = useEventStore();

	const [loading, setLoading] = useState(true);
	const [allParticipants, setAllParticipants] = useState([]);
	const [assignedParticipants, setAssignedParticipants] = useState([]);
	const [scores, setScores] = useState({});
	const [selectedParticipantId, setSelectedParticipantId] = useState("");
	const [selectedParticipantName, setSelectedParticipantName] = useState("");
	const [evaluatorId, setEvaluatorId] = useState("");
	const [open, setOpen] = useState(false);
	const [event, setEvent] = useState(null);

	const handleOpen = () => setOpen(true);

	const statusColors = {
		pending: "warning",
		ongoing: "primary",
		completed: "default",
		open: "success",
	};

	const handleClose = async () => {
		setOpen(false);
		try {
			const updatedScores = await fetchAllScoresByEvent(eventId);
			if (updatedScores && Array.isArray(updatedScores)) {
				const computedScores = updatedScores.reduce((acc, scoreEntry) => {
					const totalScore = scoreEntry.scores.reduce((sum, s) => sum + s.scoreValue, 0);
					acc[scoreEntry.participantId._id] = totalScore;
					return acc;
				}, {});
				setScores(computedScores);
			}
		} catch (error) {
			console.error("Error updating scores:", error);
		}
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const eventData = await fetchEventById(eventId);
				setEvent(eventData);

				const [participantListData, teacherEvaluatorId] = await Promise.all([
					fetchParticipantsByEvent(eventId),
					fetchTeacherEvaluatorId(teacherId, eventId),
				]);

				setAllParticipants(participantListData || []);
				setEvaluatorId(teacherEvaluatorId?.data || "");

				if (teacherEvaluatorId?.data) {
					const evaluatorStudents = await fetchAssignedStudents(teacherEvaluatorId.data);
					setAssignedParticipants(evaluatorStudents || []);
				}

				const scoreData = await fetchAllScoresByEvent(eventId);
				if (scoreData && Array.isArray(scoreData)) {
					const computedScores = scoreData.reduce((acc, scoreEntry) => {
						const totalScore = scoreEntry.scores.reduce((sum, s) => sum + s.scoreValue, 0);
						acc[scoreEntry.participantId._id] = totalScore;
						return acc;
					}, {});
					setScores(computedScores);
				} else {
					setScores({});
				}
			} catch (error) {
				console.error("Failed to load data:", error);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [teacherId, eventId]);

	const canScore = event?.status === "ongoing" || event?.status === "completed";

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				<CircularProgress size={60} />
			</Box>
		);
	}

	if (!event) {
		return (
			<Box sx={{ my: 4 }}>
				<Typography color="error">Event not found</Typography>
				<BackButton />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 2 }}>
			<BackButton />

			{/* Event Information Card */}
			<Card sx={{ mb: 3, bgcolor: "background.paper" }}>
				<CardContent>
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
						<Typography variant="h4" fontWeight={600}>
							{event.name}
						</Typography>
						<Chip
							label={event.status?.toUpperCase()}
							color={statusColors[event.status] || "default"}
							sx={{ fontWeight: 600, fontSize: "0.9rem" }}
						/>
					</Stack>

					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Typography variant="body1" paragraph>
								{event.description || "No description available"}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Stack spacing={1}>
								<Typography variant="body1">
									<strong>Type:</strong> {event.type}
								</Typography>
								<Typography variant="body1">
									<strong>Date:</strong> {new Date(event.date).toLocaleString()}
								</Typography>
								{event.criteria && event.criteria.length > 0 && (
									<Tooltip
										title={
											// Map over the criteria array to create a string for the tooltip
											event.criteria.map((c, index) => (
												<Typography key={c._id || index} variant="body2" color="inherit">
													{c.criteriaName} (Max Score: {c.maxScore})
												</Typography>
											))
										}
									>
										<Typography variant="body1" sx={{ display: "flex", alignItems: "center", cursor: "help" }}>
											<strong>Evaluation Criteria:</strong>
											<InfoIcon color="action" sx={{ ml: 1, fontSize: "1rem" }} />
										</Typography>
									</Tooltip>
								)}
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Assigned Participants Section */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
						<ScoreIcon color="primary" sx={{ mr: 1 }} />
						Your Assigned Participants
						<Chip label={`${assignedParticipants.length} assigned`} size="small" color="primary" sx={{ ml: 1.5 }} />
					</Typography>

					<TableContainer component={Paper} variant="outlined">
						<Table>
							<TableHead>
								<TableRow sx={{ bgcolor: "background.default" }}>
									<TableCell width="60px"></TableCell>
									<TableCell>
										<strong>Participant</strong>
									</TableCell>
									<TableCell align="right">
										<strong>Score</strong>
									</TableCell>
									<TableCell align="right">
										<strong>Action</strong>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{assignedParticipants.length > 0 ? (
									assignedParticipants.map((participant) => {
										const isTeam = !!participant.team;
										const isScored = scores.hasOwnProperty(participant._id);
										const disableAddScoreButton = isScored || !canScore;
										const displayName = participant.student?.name || participant.teamName || "Unknown";

										return (
											<TableRow key={participant._id} hover>
												<TableCell>
													<Avatar
														sx={{
															width: 32,
															height: 32,
															bgcolor: isTeam ? "secondary.main" : "primary.main",
														}}
													>
														{isTeam ? <GroupIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
													</Avatar>
												</TableCell>
												<TableCell>
													<Typography fontWeight={500}>{displayName}</Typography>
													{isTeam && (
														<Typography variant="caption" color="textSecondary">
															{participant.team?.length || 0} members
														</Typography>
													)}
												</TableCell>
												<TableCell align="right">
													<Chip
														label={scores[participant._id] ?? "Not scored"}
														color={isScored ? "primary" : "default"}
														variant={isScored ? "filled" : "outlined"}
													/>
												</TableCell>
												<TableCell align="right">
													<Button
														disabled={disableAddScoreButton}
														variant={isScored ? "outlined" : "contained"}
														color="primary"
														size="small"
														onClick={() => {
															setSelectedParticipantId(participant._id);
															setSelectedParticipantName(displayName);
															handleOpen();
														}}
														startIcon={isScored ? null : <ScoreIcon />}
													>
														{isScored ? "View Score" : "Add Score"}
													</Button>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={4} align="center" sx={{ py: 3 }}>
											<Typography variant="body2" color="textSecondary">
												No participants assigned to you
											</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{!canScore && (
						<Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: "italic" }}>
							Scoring is only available when the event status is "ongoing"
						</Typography>
					)}
				</CardContent>
			</Card>

			{/* All Participants Section */}
			<Card>
				<CardContent>
					<Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
						All Event Participants
						<Chip label={`${allParticipants.length} total`} size="small" sx={{ ml: 1.5 }} />
					</Typography>

					<TableContainer component={Paper} variant="outlined">
						<Table>
							<TableHead>
								<TableRow sx={{ bgcolor: "background.default" }}>
									<TableCell width="60px"></TableCell>
									<TableCell>
										<strong>Participant</strong>
									</TableCell>
									<TableCell align="right">
										<strong>Score</strong>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{allParticipants.length > 0 ? (
									allParticipants.map((participant) => {
										const isTeam = !!participant.team;
										const isScored = scores.hasOwnProperty(participant._id);
										const displayName = participant.student?.name || participant.teamName || "Unknown";

										return (
											<TableRow key={participant._id} hover>
												<TableCell>
													<Avatar
														sx={{
															width: 32,
															height: 32,
															bgcolor: isTeam ? "secondary.light" : "primary.light",
														}}
													>
														{isTeam ? <GroupIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
													</Avatar>
												</TableCell>
												<TableCell>
													<Typography fontWeight={500}>{displayName}</Typography>
													{isTeam && (
														<Typography variant="caption" color="textSecondary">
															{participant.team?.length || 0} members
														</Typography>
													)}
												</TableCell>
												<TableCell align="right">
													<Chip
														label={scores[participant._id] ?? "Not scored"}
														color={isScored ? "primary" : "default"}
														variant={isScored ? "filled" : "outlined"}
													/>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={3} align="center" sx={{ py: 3 }}>
											<Typography variant="body2" color="textSecondary">
												No participants registered for this event
											</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>

			{open && selectedParticipantId && (
				<ScoreEntryModal
					eventId={eventId}
					participantId={selectedParticipantId}
					participantName={selectedParticipantName}
					evaluatorId={evaluatorId}
					onClose={handleClose}
				/>
			)}
		</Box>
	);
};

export default ScoreParticipants;
