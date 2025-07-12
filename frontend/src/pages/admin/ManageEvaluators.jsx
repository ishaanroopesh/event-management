import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Paper, Container, Chip, Grid, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useEvaluatorStore } from "../../store/evaluator";
import { useTeacherStore } from "../../store/teacher";
import { useEventStore } from "../../store/event";
import AddEvaluatorModal from "../../components/AddEvaluatorModal";
import AddParticipantsModal from "../../components/AddParticipantsModal";
import BackButton from "../../components/BackButton";

const ManageEvaluators = () => {
	const { eventId } = useParams();
	const { fetchEvaluatorsByEvent, createEvaluator, addParticipantsToEvaluator } = useEvaluatorStore();
	const { fetchAvailableTeachers } = useTeacherStore();
	const { fetchUnassignedParticipants, fetchEventById } = useEventStore();
	const [event, setEvent] = useState(null);
	const [evaluators, setEvaluators] = useState([]);
	const [availableTeachers, setAvailableTeachers] = useState([]);
	const [eventParticipants, setEventParticipants] = useState([]);
	const [selectedEvaluatorId, setSelectedEvaluatorId] = useState("");
	const [openEvaluators, setOpenEvaluators] = useState(false);
	const [openParticipants, setOpenParticipants] = useState(false);

	const handleOpenEvaluators = () => setOpenEvaluators(true);
	const handleCloseEvaluators = () => setOpenEvaluators(false);
	const handleOpenParticipants = () => setOpenParticipants(true);
	const handleCloseParticipants = () => setOpenParticipants(false);

	// const loadEvaluatorsAndTeachers = async () => {
	// 	try {
	// 		const fetchedEvaluators = await fetchEvaluatorsByEvent(eventId);
	// 		const fetchedTeachers = await fetchAvailableTeachers(eventId);
	// 		const fetchedParticipants = await fetchUnassignedParticipants(eventId);

	// 		setEvaluators(fetchedEvaluators);
	// 		setAvailableTeachers(fetchedTeachers);
	// 		setEventParticipants(fetchedParticipants);
	// 	} catch (error) {
	// 		console.error("Failed to load evaluator data", error);
	// 	}
	// };
	const loadEvaluatorsAndTeachers = async () => {
		try {
			const eventData = await fetchEventById(eventId);
			const fetchedEvaluators = await fetchEvaluatorsByEvent(eventId);
			const fetchedTeachers = await fetchAvailableTeachers(eventId);
			const fetchedParticipants = await fetchUnassignedParticipants(eventId);

			setEvent(eventData);
			setEvaluators(fetchedEvaluators);

			// Filter teachers based on event's department
			const departmentSpecificTeachers = fetchedTeachers.filter(
				(teacher) => teacher.department === eventData.department
			);
			setAvailableTeachers(departmentSpecificTeachers);
			setEventParticipants(fetchedParticipants);
		} catch (error) {
			console.error("Failed to load evaluator data", error);
		}
	};

	useEffect(() => {
		loadEvaluatorsAndTeachers();
	}, [eventId]);

	const handleAddEvaluator = async (teacherId) => {
		await createEvaluator({ eventId, teacherId });
		await loadEvaluatorsAndTeachers();
		handleCloseEvaluators();
	};

	const handleAssign = async (evaluatorId, selectedParticipants) => {
		await addParticipantsToEvaluator(
			evaluatorId,
			Array.isArray(selectedParticipants) ? selectedParticipants : [selectedParticipants]
		);
		await loadEvaluatorsAndTeachers();
		handleCloseParticipants();
	};

	return (
		<Container maxWidth="lg">
			<BackButton />
			<Typography variant="h4" gutterBottom>
				Manage Evaluators
			</Typography>

			<Paper elevation={3} sx={{ p: 2, mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					Add New Evaluator
				</Typography>
				<Button
					variant="contained"
					startIcon={<PersonAddIcon />}
					onClick={handleOpenEvaluators}
					disabled={availableTeachers.length === 0}
				>
					{availableTeachers.length === 0 ? "No teachers available" : "Add Evaluator"}
				</Button>
			</Paper>

			<Paper elevation={3} sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Assigned Evaluators
				</Typography>

				{evaluators.length === 0 ? (
					<Typography color="textSecondary">No evaluators added yet.</Typography>
				) : (
					<Grid container spacing={2}>
						{evaluators.map((evaluator) => (
							<Grid item xs={12} sm={6} md={4} key={evaluator._id}>
								{/* <Card sx={{ height: "100%" }}>
									<CardContent>
										<Typography variant="h6">{evaluator.teacherId?.name}</Typography>
										<Typography variant="body2" color="textSecondary">
											{evaluator.teacherId?.email}
										</Typography>
										<Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
											<Chip
												label={`${evaluator.assignedStudents.length} Participant(s)`}
												color="primary"
												size="small"
											/>
											<Button
												size="small"
												variant="outlined"
												onClick={() => {
													setSelectedEvaluatorId(evaluator._id);
													handleOpenParticipants();
												}}
											>
												Assign Participants
											</Button>
										</Box>
									</CardContent>
								</Card> */}
								<Card sx={{ height: "100%", transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
									<CardContent>
										<Box display="flex" alignItems="center" gap={1} mb={1}>
											<Avatar>{evaluator.teacherId?.name?.[0]}</Avatar>
											<Box>
												<Typography variant="h6">{evaluator.teacherId?.name}</Typography>
												<Typography variant="body2" color="textSecondary">
													{evaluator.teacherId?.email}
												</Typography>
											</Box>
										</Box>
										<Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
											<Chip
												label={`${evaluator.assignedStudents.length} Participant(s)`}
												color="primary"
												size="small"
											/>
											<Button
												size="small"
												variant="outlined"
												onClick={() => {
													setSelectedEvaluatorId(evaluator._id);
													handleOpenParticipants();
												}}
											>
												Assign
											</Button>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}
			</Paper>

			{openEvaluators && (
				<AddEvaluatorModal
					eventId={eventId}
					availableTeachers={availableTeachers}
					onAddEvaluator={handleAddEvaluator}
					onClose={handleCloseEvaluators}
				/>
			)}

			{openParticipants && (
				<AddParticipantsModal
					evaluators={evaluators}
					selectedEvaluatorId={selectedEvaluatorId}
					participants={eventParticipants}
					onAssign={handleAssign}
					onClose={handleCloseParticipants}
				/>
			)}
		</Container>
	);
};

export default ManageEvaluators;
