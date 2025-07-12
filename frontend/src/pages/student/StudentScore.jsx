// import { useParams } from "react-router-dom";
// import {
// 	Card,
// 	CardContent,
// 	Container,
// 	Typography,
// 	CircularProgress,
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Paper,
// } from "@mui/material";
// import { useScoreStore } from "../../store/score.js";
// import { useEffect, useState } from "react";
// import BackButton from "../../components/BackButton.jsx";

// const StudentScore = () => {
// 	const { eventId, participantId } = useParams();
// 	const { fetchParticipantScore } = useScoreStore();
// 	const [participantScores, setParticipantScores] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);

// 	useEffect(() => {
// 		const loadScoreRecords = async () => {
// 			try {
// 				const participantScoreData = await fetchParticipantScore(eventId, participantId);
// 				if (participantScoreData) {
// 					setParticipantScores(participantScoreData);
// 				} else {
// 					setError("No scores found for this event.");
// 				}
// 			} catch (error) {
// 				setError("Failed to load scores. Please try again.");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		loadScoreRecords();
// 	}, [eventId, participantId, fetchParticipantScore]);

// 	return (
// 		<Container>
// 			<BackButton />
// 			<Typography variant="h4" gutterBottom>
// 				Event Scores
// 			</Typography>

// 			{loading ? (
// 				<CircularProgress />
// 			) : error ? (
// 				<Typography color="error">{error}</Typography>
// 			) : participantScores ? (
// 				<Card sx={{ mb: 3 }}>
// 					<CardContent>
// 						<Typography variant="h5" gutterBottom>
// 							Participant ID: {participantScores.participantId?._id}
// 						</Typography>
// 						<Typography variant="subtitle1" sx={{ mb: 2 }}>
// 							Evaluator: {participantScores.evaluatorId?._id}
// 						</Typography>

// 						{/* Table for Scores */}
// 						<TableContainer component={Paper}>
// 							<Table>
// 								<TableHead>
// 									<TableRow>
// 										<TableCell>Criteria</TableCell>
// 										<TableCell align="right">Score</TableCell>
// 									</TableRow>
// 								</TableHead>
// 								<TableBody>
// 									{participantScores.scores?.map((score, index) => (
// 										<TableRow key={index}>
// 											<TableCell>{score.criteriaName}</TableCell>
// 											<TableCell align="right">{score.scoreValue}</TableCell>
// 										</TableRow>
// 									))}
// 								</TableBody>
// 							</Table>
// 						</TableContainer>

// 						{/* Total Score */}
// 						<Typography variant="h6" sx={{ mt: 2 }}>
// 							Total Score: {participantScores.totalScore || "N/A"}
// 						</Typography>
// 					</CardContent>
// 				</Card>
// 			) : (
// 				<Typography>No score data available.</Typography>
// 			)}
// 		</Container>
// 	);
// };

// export default StudentScore;

import { useParams } from "react-router-dom";
import {
	Card,
	CardContent,
	Container,
	Typography,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	List,
	ListItem,
} from "@mui/material";
import { useScoreStore } from "../../store/score.js";
import { useStudentStore } from "../../store/student";
import { useEventStore } from "../../store/event.js";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton.jsx";

const StudentScore = () => {
	const { eventId, participantId } = useParams();
	const [event, setEvent] = useState(null);
	const { fetchParticipantScore } = useScoreStore();
	const { fetchStudentById } = useStudentStore();
	const { fetchEventById } = useEventStore();
	const [participantScores, setParticipantScores] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [memberDetails, setMemberDetails] = useState([]);

	useEffect(() => {
		const loadScoreRecords = async () => {
			try {
				const scoreData = await fetchParticipantScore(eventId, participantId);

				if (scoreData) {
					setParticipantScores(scoreData);

					const members = scoreData.participantId?.members || [];
					console.log(members);
					setMemberDetails(members);
				} else {
					setError("No scores found for this event.");
				}
			} catch (err) {
				console.error(err);
				setError("Failed to load scores. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		loadScoreRecords();
	}, [eventId, participantId, fetchParticipantScore, fetchStudentById]);

	// useEffect(() => {
	// 	const loadEvent = async () => {
	// 		try {
	// 			setLoading(true);
	// 			const eventData = await fetchEventById(eventId);
	// 			if (eventData) {
	// 				setEvent(eventData);
	// 			} else {
	// 				setError("Event not found.");
	// 			}
	// 		} catch (error) {
	// 			setError("Failed to load event data.");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};
	// 	loadEvent();
	// }, [eventId, fetchEventById]);

	return (
		<Container>
			<BackButton />
			<Typography variant="h4" gutterBottom>
				Event Scores
			</Typography>

			{loading ? (
				<CircularProgress />
			) : error ? (
				<Typography color="error">{error}</Typography>
			) : participantScores ? (
				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant="h5" gutterBottom>
							Event: {participantScores.eventId?.name}
						</Typography>
						<Typography variant="subtitle1" sx={{ mb: 2 }}>
							Evaluator: {participantScores.evaluatorId?.teacherId?.name || "Unknown"}
						</Typography>

						{participantScores.participantId?.teamName && (
							<Box sx={{ mb: 2 }}>
								<Typography variant="h5">Team Name: {participantScores.participantId.teamName}</Typography>
								<Typography variant="body2" color="text.secondary">
									Team Members:
								</Typography>
								<List sx={{ color: "text.secondary", variant: "body3", lineHeight: 0.5 }}>
									{memberDetails.map((member) => (
										// Use MUI ListItem (like <li>), putting text directly inside
										<ListItem key={member._id}>{member.name}</ListItem>
									))}
								</List>
							</Box>
						)}

						{/* Table for Scores */}
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Criteria</TableCell>
										<TableCell align="right">Score</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{participantScores.scores?.map((score, index) => (
										<TableRow key={index}>
											<TableCell>{score.criteriaName}</TableCell>
											<TableCell align="right">{score.scoreValue}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>

						<Typography variant="h6" sx={{ mt: 2 }}>
							Total Score: {participantScores.totalScore || "N/A"}
						</Typography>
					</CardContent>
				</Card>
			) : (
				<Typography>No score data available.</Typography>
			)}
		</Container>
	);
};

export default StudentScore;
