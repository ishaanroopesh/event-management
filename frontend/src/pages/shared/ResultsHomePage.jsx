// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { getEvents } from "../../hooks/useEvents";
// import { AuthContext } from "../../context/AuthContext";
// import { Card, CardContent, Typography, Grid, Paper, Container } from "@mui/material";
// import { formatDateForInput } from "../../utils/dateFormat";
// import BackButton from "../../components/BackButton";

// const ResultsHomePage = () => {
// 	const navigate = useNavigate();
// 	const { events } = getEvents();
// 	const { user, role, logout } = useContext(AuthContext);

// 	const handleDoubleClick = (eventId) => {
// 		navigate(`/event-results/${eventId}`);
// 	};

// 	// Filter events with resultsPublished = true and sort by date (latest first)
// 	const filteredEvents = events
// 		.filter((event) => event.resultsPublished)
// 		.sort((a, b) => new Date(b.date) - new Date(a.date));

// 	return (
// 		<Container>
// 			<BackButton />
// 			<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
// 				<Typography variant="h4" gutterBottom>
// 					Available Results
// 				</Typography>
// 				<Grid container spacing={2}>
// 					{filteredEvents.map((event) => (
// 						<Grid item xs={12} sm={6} md={4} key={event._id}>
// 							<Card
// 								sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { boxShadow: 6 } }}
// 								onDoubleClick={() => handleDoubleClick(event._id)}
// 							>
// 								<CardContent>
// 									<Typography variant="h6" fontWeight={600} gutterBottom>
// 										{event.name}
// 									</Typography>
// 									<Typography variant="body2" color="text.secondary">
// 										Date: {formatDateForInput(event.date)}
// 									</Typography>
// 									<Typography variant="body2" color="text.secondary" sx={{ height: 50, overflow: "hidden" }}>
// 										{event.description.length > 80 ? event.description.substring(0, 80) + "..." : event.description}
// 									</Typography>
// 								</CardContent>
// 							</Card>
// 						</Grid>
// 					))}
// 				</Grid>
// 			</Paper>
// 		</Container>
// 	);
// };

// export default ResultsHomePage;

import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../hooks/useEvents";
import { AuthContext } from "../../context/AuthContext";
import { Card, CardContent, Typography, Grid, Paper, Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { formatDateForInput } from "../../utils/dateFormat";
import BackButton from "../../components/BackButton";

const ResultsHomePage = () => {
	const navigate = useNavigate();
	const { events } = getEvents();
	const { user } = useContext(AuthContext);
	const [searchQuery, setSearchQuery] = useState("");

	const handleDoubleClick = (eventId) => {
		navigate(`/event-results/${eventId}`);
	};

	const filteredEvents = useMemo(() => {
		return events
			.filter(
				(event) =>
					event.resultsPublished &&
					(event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						event.description.toLowerCase().includes(searchQuery.toLowerCase()))
			)
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [events, searchQuery]);

	return (
		<Container>
			<BackButton />
			<Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
				<Typography variant="h4" gutterBottom>
					Available Results
				</Typography>

				<TextField
					fullWidth
					variant="outlined"
					placeholder="Search events..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					sx={{ mb: 3 }}
				/>

				<Grid container spacing={2}>
					{filteredEvents.length > 0 ? (
						filteredEvents.map((event) => (
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
										<Typography variant="body2" color="text.secondary" sx={{ height: 50, overflow: "hidden" }}>
											{event.description.length > 80 ? event.description.substring(0, 80) + "..." : event.description}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))
					) : (
						<Typography variant="body2" sx={{ m: 2 }}>
							No results found.
						</Typography>
					)}
				</Grid>
			</Paper>
		</Container>
	);
};

export default ResultsHomePage;
