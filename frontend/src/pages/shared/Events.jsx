// import React, { useContext, useEffect, useState } from "react";
// import {
// 	Container,
// 	Grid,
// 	Card,
// 	CardContent,
// 	Typography,
// 	TextField,
// 	MenuItem,
// 	Select,
// 	InputLabel,
// 	FormControl,
// 	Chip,
// 	Box,
// 	CardMedia,
// 	Button,
// } from "@mui/material";
// import { useEventStore } from "../../store/event";
// import { Link } from "react-router-dom";
// import { convertGoogleDriveLink } from "../../utils/formatDriveLink";
// import { AuthContext } from "../../context/AuthContext";

// const EventListPage = () => {
// 	const { user, role } = useContext(AuthContext);
// 	const { fetchEvents } = useEventStore();
// 	const [events, setEvents] = useState([]);
// 	const [filteredEvents, setFilteredEvents] = useState([]);
// 	const [filters, setFilters] = useState({
// 		search: "",
// 		department: "",
// 		status: "",
// 		type: "",
// 		teamEvent: "",
// 	});

// 	useEffect(() => {
// 		const loadEvents = async () => {
// 			const allEvents = (await fetchEvents()).sort((a, b) => new Date(b.date) - new Date(a.date));
// 			setEvents(allEvents);
// 			setFilteredEvents(allEvents);
// 		};
// 		loadEvents();
// 	}, [fetchEvents]);

// 	useEffect(() => {
// 		const filtered = events.filter((event) => {
// 			// ✅ Only show "pending" events to admins
// 			if (event.status === "pending" && role !== "admin") return false;

// 			const matchesSearch =
// 				event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
// 				event.type.toLowerCase().includes(filters.search.toLowerCase());

// 			const matchesDept = filters.department ? event.department === filters.department : true;
// 			const matchesStatus = filters.status ? event.status === filters.status : true;
// 			const matchesType = filters.type ? event.type === filters.type : true;
// 			const matchesTeam =
// 				filters.teamEvent === "team" ? event.teamEvent : filters.teamEvent === "individual" ? !event.teamEvent : true;

// 			return matchesSearch && matchesDept && matchesStatus && matchesType && matchesTeam;
// 		});

// 		setFilteredEvents(filtered);
// 	}, [filters, events, role]);

// 	const handleFilterChange = (field) => (e) => {
// 		setFilters({ ...filters, [field]: e.target.value });
// 	};

// 	const handleDoubleClick = (eventId) => {
// 		const basePath = role === "student" ? "/student/event" : "/event";
// 		navigate(`${basePath}/${eventId}`);
// 	};

// 	const getStatusColor = (status) => {
// 		switch (status) {
// 			case "pending":
// 				return "warning";
// 			case "open":
// 				return "success";
// 			case "ongoing":
// 				return "primary";
// 			case "completed":
// 				return "default";
// 			default:
// 				return "default";
// 		}
// 	};

// 	return (
// 		<Container sx={{ my: 4 }}>
// 			<Typography variant="h4" gutterBottom>
// 				All Events
// 			</Typography>

// 			{/* Filter Controls */}
// 			<Grid container spacing={2} sx={{ mb: 4 }}>
// 				<Grid item xs={12} sm={6} md={4}>
// 					<TextField
// 						fullWidth
// 						label="Search by name or type"
// 						value={filters.search}
// 						onChange={handleFilterChange("search")}
// 					/>
// 				</Grid>

// 				<Grid item xs={12} sm={6} md={3}>
// 					<FormControl fullWidth>
// 						<InputLabel>Department</InputLabel>
// 						<Select value={filters.department} label="Department" onChange={handleFilterChange("department")}>
// 							<MenuItem value="">All</MenuItem>
// 							<MenuItem value="CSE">CSE</MenuItem>
// 							<MenuItem value="ISE">ISE</MenuItem>
// 							<MenuItem value="ECE">ECE</MenuItem>
// 							<MenuItem value="AIML">AIML</MenuItem>
// 							<MenuItem value="AIDS">AIDS</MenuItem>
// 						</Select>
// 					</FormControl>
// 				</Grid>

// 				<Grid item xs={12} sm={6} md={3}>
// 					<FormControl fullWidth>
// 						<InputLabel>Status</InputLabel>
// 						<Select value={filters.status} label="Status" onChange={handleFilterChange("status")}>
// 							<MenuItem value="">All</MenuItem>
// 							<MenuItem value="pending">Pending</MenuItem>
// 							<MenuItem value="open">Open</MenuItem>
// 							<MenuItem value="ongoing">Ongoing</MenuItem>
// 							<MenuItem value="completed">Completed</MenuItem>
// 						</Select>
// 					</FormControl>
// 				</Grid>

// 				<Grid item xs={12} sm={6} md={3}>
// 					<FormControl fullWidth>
// 						<InputLabel>Team / Individual</InputLabel>
// 						<Select value={filters.teamEvent} label="Team / Individual" onChange={handleFilterChange("teamEvent")}>
// 							<MenuItem value="">Both</MenuItem>
// 							<MenuItem value="team">Team</MenuItem>
// 							<MenuItem value="individual">Individual</MenuItem>
// 						</Select>
// 					</FormControl>
// 				</Grid>
// 			</Grid>

// 			{/* Event Cards */}
// 			<Grid container spacing={3}>
// 				{filteredEvents.map((event) => (
// 					<Grid item xs={12} sm={6} md={4} key={event._id}>
// 						<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
// 							<CardMedia
// 								component="img"
// 								image={`/api/events/poster/${event._id}`}
// 								alt={`${event.name} poster`}
// 								loading="lazy"
// 								onError={(e) => {
// 									e.target.onerror = null;
// 									e.target.src = "/fallback-image.jpg";
// 								}}
// 								sx={{
// 									width: "100%",
// 									aspectRatio: "1 / 1", // 👈 Enforces square shape
// 									objectFit: "cover",
// 									borderRadius: 2,
// 								}}
// 								onDoubleClick={() => handleDoubleClick(event._id)}
// 							/>
// 							<CardContent>
// 								<Typography variant="h6" gutterBottom>
// 									{event.name}
// 								</Typography>
// 								<Typography variant="body2" color="text.secondary">
// 									{event.description.slice(0, 80)}...
// 								</Typography>
// 								<Box mt={1}>
// 									<Chip label={event.department} size="small" sx={{ mr: 1 }} />
// 									<Chip label={event.type} size="small" sx={{ mr: 1 }} />
// 									<Chip label={event.status} color={getStatusColor(event.status)} size="small" sx={{ mr: 1 }} />
// 									<Chip
// 										label={event.teamEvent ? `Team (${event.teamSize})` : "Individual"}
// 										variant="outlined"
// 										size="small"
// 									/>
// 								</Box>
// 								<Box mt={2}>
// 									{role === "admin" ||
// 										(role === "teacher" && (
// 											<Button variant="outlined" size="small" component={Link} to={`/event/${event._id}`}>
// 												View Details
// 											</Button>
// 										))}
// 									{role === "student" && (
// 										<Button variant="outlined" size="small" component={Link} to={`/student/event/${event._id}`}>
// 											View Details
// 										</Button>
// 									)}
// 								</Box>
// 							</CardContent>
// 						</Card>
// 					</Grid>
// 				))}
// 			</Grid>
// 		</Container>
// 	);
// };

// export default EventListPage;

import React, { useContext, useEffect, useState } from "react";
import {
	Container,
	Grid,
	Card,
	CardContent,
	Typography,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Chip,
	Box,
	CardMedia,
	Button,
} from "@mui/material";
import { useEventStore } from "../../store/event";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate import
import { convertGoogleDriveLink } from "../../utils/formatDriveLink";
import { AuthContext } from "../../context/AuthContext";

const EventListPage = () => {
	const { user, role } = useContext(AuthContext);
	const { fetchEvents } = useEventStore();
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [filters, setFilters] = useState({
		search: "",
		department: "",
		status: "",
		type: "",
		teamEvent: "",
	});
	const navigate = useNavigate(); // Initialize navigate function

	useEffect(() => {
		const loadEvents = async () => {
			const allEvents = (await fetchEvents()).sort((a, b) => new Date(b.date) - new Date(a.date));
			setEvents(allEvents);
			setFilteredEvents(allEvents);
		};
		loadEvents();
	}, [fetchEvents]);

	useEffect(() => {
		const filtered = events.filter((event) => {
			// ✅ Only show "pending" events to admins
			if (event.status === "pending" && role !== "admin") return false;

			const matchesSearch =
				event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				event.type.toLowerCase().includes(filters.search.toLowerCase());

			const matchesDept = filters.department ? event.department === filters.department : true;
			const matchesStatus = filters.status ? event.status === filters.status : true;
			const matchesType = filters.type ? event.type === filters.type : true;
			const matchesTeam =
				filters.teamEvent === "team" ? event.teamEvent : filters.teamEvent === "individual" ? !event.teamEvent : true;

			return matchesSearch && matchesDept && matchesStatus && matchesType && matchesTeam;
		});

		setFilteredEvents(filtered);
	}, [filters, events, role]);

	const handleFilterChange = (field) => (e) => {
		setFilters({ ...filters, [field]: e.target.value });
	};

	const handleDoubleClick = (eventId) => {
		const basePath = role === "student" ? "/student/event" : "/event";
		navigate(`${basePath}/${eventId}`);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "warning";
			case "open":
				return "success";
			case "ongoing":
				return "primary";
			case "completed":
				return "default";
			default:
				return "default";
		}
	};

	return (
		<Container sx={{ my: 4 }}>
			<Typography variant="h4" gutterBottom>
				All Events
			</Typography>

			{/* Filter Controls */}
			<Grid container spacing={2} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={4}>
					<TextField
						fullWidth
						label="Search by name or type"
						value={filters.search}
						onChange={handleFilterChange("search")}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<FormControl fullWidth>
						<InputLabel>Department</InputLabel>
						<Select value={filters.department} label="Department" onChange={handleFilterChange("department")}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="CSE">CSE</MenuItem>
							<MenuItem value="ISE">ISE</MenuItem>
							<MenuItem value="ECE">ECE</MenuItem>
							<MenuItem value="AIML">AIML</MenuItem>
							<MenuItem value="AIDS">AIDS</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select value={filters.status} label="Status" onChange={handleFilterChange("status")}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="pending">Pending</MenuItem>
							<MenuItem value="open">Open</MenuItem>
							<MenuItem value="ongoing">Ongoing</MenuItem>
							<MenuItem value="completed">Completed</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<FormControl fullWidth>
						<InputLabel>Team / Individual</InputLabel>
						<Select value={filters.teamEvent} label="Team / Individual" onChange={handleFilterChange("teamEvent")}>
							<MenuItem value="">Both</MenuItem>
							<MenuItem value="team">Team</MenuItem>
							<MenuItem value="individual">Individual</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			{/* Event Cards */}
			<Grid container spacing={3}>
				{filteredEvents.map((event) => (
					<Grid item xs={12} sm={6} md={4} key={event._id}>
						<Card
							sx={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								cursor: "pointer", // Add pointer cursor to indicate clickability
								transition: "transform 0.2s ease-in-out",
								"&:hover": {
									transform: "translateY(-5px)",
									boxShadow: 6,
								},
							}}
							onDoubleClick={() => handleDoubleClick(event._id)}
						>
							<CardMedia
								component="img"
								image={`/api/events/poster/${event._id}`}
								alt={`${event.name} poster`}
								loading="lazy"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/fallback-image.jpg";
								}}
								sx={{
									width: "100%",
									aspectRatio: "1 / 1",
									objectFit: "cover",
									borderRadius: 2,
								}}
							/>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									{event.name}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{event.description.slice(0, 80)}...
								</Typography>
								<Box mt={1}>
									<Chip label={event.department} size="small" sx={{ mr: 1 }} />
									<Chip label={event.type} size="small" sx={{ mr: 1 }} />
									<Chip label={event.status} color={getStatusColor(event.status)} size="small" sx={{ mr: 1 }} />
									<Chip
										label={event.teamEvent ? `Team (${event.teamSize})` : "Individual"}
										variant="outlined"
										size="small"
									/>
								</Box>
								<Box mt={2}>
									{role === "admin" ||
										(role === "teacher" && (
											<Button
												variant="outlined"
												size="small"
												component={Link}
												to={`/event/${event._id}`}
												onClick={(e) => e.stopPropagation()} // Prevent double-click when clicking button
											>
												View Details
											</Button>
										))}
									{role === "student" && (
										<Button
											variant="outlined"
											size="small"
											component={Link}
											to={`/student/event/${event._id}`}
											onClick={(e) => e.stopPropagation()} // Prevent double-click when clicking button
										>
											View Details
										</Button>
									)}
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default EventListPage;
