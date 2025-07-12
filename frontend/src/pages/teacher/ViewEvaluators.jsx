import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, IconButton, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEvaluatorStore } from "../../store/evaluator";
import { useEventStore } from "../../store/event";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../../components/BackButton";

const ViewEvaluators = () => {
	const { eventId } = useParams();
	const { user, role, logout } = useContext(AuthContext);
	const { fetchEvaluatorsByEvent } = useEvaluatorStore();
	const { fetchEventById } = useEventStore();
	const [evaluators, setEvaluators] = useState([]);
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Fetch evaluators and available teachers
	const loadEvaluatorsAndEvent = async () => {
		try {
			setLoading(true);
			setError("");

			// Fetch evaluators
			const fetchedEvaluators = await fetchEvaluatorsByEvent(eventId);
			setEvaluators(fetchedEvaluators);

			const fetchedEvent = await fetchEventById(eventId);
			setEvent(fetchedEvent);
		} catch (error) {
			setError("Failed to load data.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadEvaluatorsAndEvent();
	}, [eventId]);

	return (
		<Box p={3}>
			<BackButton />
			<Typography variant="h5" mb={2}>
				{event?.name} Evaluators
			</Typography>

			<Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2} mt={3}>
				{evaluators.map((evaluator) => (
					<Card key={evaluator._id}>
						<CardContent>
							<Typography variant="h6">{evaluator.teacherId?.name}</Typography>
							<Typography color="textSecondary">{evaluator.teacherId?.email}</Typography>
							<Typography variant="body2">Participants: {evaluator.assignedStudents.length}</Typography>
							{evaluator.teacherId.email === user.email && (
								<Button
									variant="contained"
									color="primary"
									component={Link}
									to={`/teacher/${evaluator.teacherId?._id}/score-participants/${evaluator.eventId}`}
								>
									Check work status
								</Button>
							)}
						</CardContent>
					</Card>
				))}
			</Box>
		</Box>
	);
};

export default ViewEvaluators;
