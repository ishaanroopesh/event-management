import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEventStore } from "../../store/event";
import { useParticipantStore } from "../../store/participant";
import { useScoreStore } from "../../store/score.js";
import { Card, CardContent, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { formatDateForInput } from "../../utils/dateFormat";
import BackButton from "../../components/BackButton.jsx";

const EventResultPage = () => {
	const { eventId } = useParams();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { fetchEventById } = useEventStore();
	const { fetchParticipantsByEvent } = useParticipantStore();
	const [allParticipants, setAllParticipants] = useState([]);
	const { fetchAllScoresByEvent } = useScoreStore();
	const [sortedResults, setSortedResults] = useState([]);

	useEffect(() => {
		const loadEvent = async () => {
			try {
				setLoading(true);
				setError("");

				// Fetch Event
				const eventData = await fetchEventById(eventId);
				if (eventData) {
					setEvent({
						...eventData,
						date: formatDateForInput(eventData.date),
					});
				} else {
					setError("Event not found.");
				}

				// Fetch Participants
				const participantList = await fetchParticipantsByEvent(eventId);
				const scoresList = await fetchAllScoresByEvent(eventId);

				// Create a participant-score mapping
				const scoresMap = {};
				scoresList.forEach((score) => {
					if (score.participantId) {
						scoresMap[score.participantId._id] = score.totalScore;
					}
				});

				// Combine participants with scores
				const results = participantList.map((participant) => ({
					...participant,
					score: scoresMap[participant._id] ?? 0, // Default score to 0 if not found
				}));

				// Sort by score (descending order)
				results.sort((a, b) => b.score - a.score);

				setAllParticipants(results);
				setSortedResults(results);
			} catch (error) {
				setError("Failed to load event data.");
			} finally {
				setLoading(false);
			}
		};
		loadEvent();
	}, [eventId, fetchEventById]);

	if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
	if (!event)
		return (
			<Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
				Event not found
			</Typography>
		);

	return (
		<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
			<BackButton />
			<Typography variant="h4" fontWeight={600} gutterBottom>
				{event.name} - Results
			</Typography>
			<Typography variant="subtitle1" color="text.secondary" gutterBottom>
				{event.description}
			</Typography>
			{event.poster && (
				<Grid container justifyContent="center" sx={{ my: 3 }}>
					<Grid item>
						<img
							src={`/api/events/poster/${event._id}`}
							alt={`${event.name} Poster`}
							style={{
								width: "300px",
								height: "300px",
								objectFit: "cover",
								borderRadius: "12px",
								boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
							}}
							loading="lazy"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/fallback-image.jpg";
							}}
						/>
					</Grid>
				</Grid>
			)}

			{/* Podium Section */}
			<Grid
				container
				justifyContent="center"
				spacing={2}
				sx={{ mb: 5, mt: 3, display: "flex", alignItems: "flex-end" }}
			>
				{/* 2nd place (Left) */}
				<Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
					{sortedResults[1] && (
						<Card
							sx={{
								width: "170px",
								height: "170px",
								backgroundColor: "#C0C0C0",
								color: "white",
								textAlign: "center",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<CardContent>
								<Typography variant="h6">🥈</Typography>
								<Typography variant="h5" sx={{ fontWeight: "bold" }}>
									{sortedResults[1].student.name || sortedResults[1].teamName}
								</Typography>
								{console.log(sortedResults[1])}
								<Typography variant="subtitle1">{sortedResults[1].score}</Typography>
							</CardContent>
						</Card>
					)}
				</Grid>

				{/* 1st place (Center, taller) */}
				<Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
					{sortedResults[0] && (
						<Card
							sx={{
								width: "190px",
								height: "190px",
								backgroundColor: "#FFD700",
								color: "white",
								textAlign: "center",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<CardContent>
								<Typography variant="h5">🥇</Typography>
								<Typography variant="h5" sx={{ fontWeight: "bold" }}>
									{sortedResults[0].student.name || sortedResults[0].teamName}
								</Typography>
								<Typography variant="h6">{sortedResults[0].score}</Typography>
							</CardContent>
						</Card>
					)}
				</Grid>

				{/* 3rd place (Right) */}
				<Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
					{sortedResults[2] && (
						<Card
							sx={{
								width: "140px",
								height: "140px",
								backgroundColor: "#CD7F32",
								color: "white",
								textAlign: "center",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<CardContent>
								<Typography variant="h6">🥉</Typography>
								<Typography variant="h5" sx={{ fontWeight: "bold" }}>
									{sortedResults[2].student.name || sortedResults[2].teamName}
								</Typography>
								<Typography variant="subtitle1">{sortedResults[2].score}</Typography>
							</CardContent>
						</Card>
					)}
				</Grid>
			</Grid>

			{/* General Results */}
			<Grid container spacing={2}>
				{sortedResults.map((participant, index) => (
					<Grid item xs={12} sm={12} md={12} key={participant._id}>
						<Card sx={{ boxShadow: index < 3 ? 6 : 3 }}>
							<CardContent>
								<Typography variant="h6" fontWeight={600}>
									{index + 1}. {participant.student.name || participant.teamName}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Score: {participant.score}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Paper>
	);
};

export default EventResultPage;
