import { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { useEventStore } from "../../store/event.js"; // Assuming event data is stored here
import { useScoreStore } from "../../store/score.js"; // Assuming scores are stored here

const ScoreEntryModal = ({ eventId, participantId, participantName, evaluatorId, onClose }) => {
	const { fetchEventById } = useEventStore(); // Fetch event criteria
	const { createScore } = useScoreStore(); // API to submit score

	const [criteria, setCriteria] = useState([]);
	const [totalScore, setTotalScore] = useState(0);
	const [comments, setComments] = useState("");

	// Fetch event criteria when modal opens
	useEffect(() => {
		const loadEventCriteria = async () => {
			try {
				const eventData = await fetchEventById(eventId);
				if (eventData && eventData.criteria) {
					// Initialize criteria with event criteria and default scoreValue = 0
					setCriteria(
						eventData.criteria.map((c) => ({ criteriaName: c.criteriaName, scoreValue: 0, maxScore: c.maxScore }))
					);
				}
				console.log(criteria);
			} catch (error) {
				console.error("Error fetching event criteria:", error);
			}
		};
		loadEventCriteria();
	}, [eventId, fetchEventById]);

	// Handle Score Change
	const handleScoreChange = (index, value) => {
		const newValue = Math.max(0, Math.min(value, criteria[index].maxScore));
		const newCriteria = [...criteria];
		newCriteria[index].scoreValue = newValue;
		setCriteria(newCriteria);

		// Calculate total score
		const total = newCriteria.reduce((sum, c) => sum + Number(c.scoreValue), 0);
		setTotalScore(total);
	};

	// Handle Submission
	const handleSubmit = async () => {
		const scoreData = {
			eventId,
			participantId,
			evaluatorId,
			scores: criteria,
			totalScore,
			comments,
		};

		try {
			await createScore(scoreData);
		} catch (error) {
			console.error("Error submitting score:", error);
		} finally {
			onClose(); // Ensures it runs even if an error occurs
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box p={3} bgcolor="white" m="auto" mt={10} width={400} borderRadius={2}>
				<Typography variant="h6">Score Participant</Typography>

				{/* <Typography>{participantId.student ? participantId.student?.name : participantId.teamName}</Typography> */}
				<Typography variant="h4">{participantName}</Typography>

				{/* Render Input Fields for Each Criterion */}
				{criteria.map((c, index) => (
					<Box key={index} mt={2}>
						<Typography>{c.criteriaName}</Typography>
						<TextField
							fullWidth
							type="number"
							value={c.scoreValue}
							onChange={(e) => handleScoreChange(index, Number(e.target.value))}
						/>
						<Typography variant="caption">/ {c.maxScore}</Typography>
					</Box>
				))}

				{/* Comments Input */}
				<Box mt={2}>
					<Typography>Comments (optional)</Typography>
					<TextField fullWidth multiline rows={2} value={comments} onChange={(e) => setComments(e.target.value)} />
				</Box>

				{/* Buttons */}
				<Box mt={2} display="flex" justifyContent="space-between">
					<Typography variant="h6">Total Score: {totalScore}</Typography>
					<Button variant="contained" onClick={handleSubmit}>
						Submit
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ScoreEntryModal;
