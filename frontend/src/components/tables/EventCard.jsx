import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Card, CardContent, Typography, Grid, Paper, Chip, Box, Container } from "@mui/material";
import { getEvents } from "../../hooks/useEvents";
import { formatDateForInput } from "../../utils/dateFormat";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../BackButton";

const EventCard = () => {
	const navigate = useNavigate();
	const { events } = getEvents();
	const { user, role, logout } = useContext(AuthContext);

	const handleDoubleClick = (eventId) => {
		if (role === "admin") {
			navigate(`/admin/event/${eventId}`);
		} else if (role === "teacher") {
			navigate(`/teacher/event/${eventId}`);
		} else {
			navigate(`/event/${eventId}`);
		}
	};

	// Categorizing events by status
	const categorizedEvents = {
		pending: [],
		open: [],
		ongoing: [],
		completed: [],
	};

	events.forEach((event) => {
		if (categorizedEvents[event.status]) {
			categorizedEvents[event.status].push(event);
		}
	});

	// Get status chip color
	const getStatusColor = (status) => {
		switch (status) {
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

	return (
		<Container>
			<BackButton />
			{Object.entries(categorizedEvents).map(([status, events]) => (
				<Paper key={status} elevation={3} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
					<Typography variant="h6" sx={{ textTransform: "capitalize", mb: 2 }}>
						{status} Events <Chip label={events.length} size="small" color={getStatusColor(status)} sx={{ ml: 1 }} />
					</Typography>
					<Grid container spacing={2}>
						{events.map((event) => (
							<Grid item xs={12} sm={6} md={4} key={event._id}>
								<Card
									sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { boxShadow: 6 } }}
									onDoubleClick={() => handleDoubleClick(event._id)}
								>
									<CardContent>
										<Typography variant="h6" fontWeight={600} gutterBottom>
											{event.name}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Date: {formatDateForInput(event.date)}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Description: {event.description}
										</Typography>
										<Chip label={status} color={getStatusColor(status)} size="small" sx={{ mt: 1 }} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Paper>
			))}
		</Container>
	);
};

export default EventCard;
