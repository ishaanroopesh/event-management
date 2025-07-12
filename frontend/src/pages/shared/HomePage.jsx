// import React, { useContext } from "react";
// import { Container, Typography, Paper, Box, Button, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext.jsx";
// import { getEvents } from "../../hooks/useEvents.js";
// import { useEventStore } from "../../store/event.js";
// import { ScrollMenu } from "react-horizontal-scrolling-menu";
// import { formatDateForInput } from "../../utils/dateFormat.jsx";
// import "react-horizontal-scrolling-menu/dist/styles.css";

// const HomePage = () => {
// 	const navigate = useNavigate();
// 	const { user, role } = useContext(AuthContext);
// 	const { events } = getEvents();
// 	const { getPoster } = useEventStore();

// 	const handleDoubleClick = (eventId) => {
// 		const basePath = role === "student" ? "/student/event" : "/event";
// 		navigate(`${basePath}/${eventId}`);
// 	};

// 	const handleDashboardRedirect = () => {
// 		if (role === "admin") navigate("/admin/home");
// 		else if (role === "teacher") navigate("/teacher/home");
// 		else if (role === "student") navigate("/student/dashboard");
// 	};

// 	// Prioritized & filtered events
// 	const openEvents = events.filter((e) => e.status === "open");
// 	const ongoingEvents = events.filter((e) => e.status === "ongoing");
// 	const completedEvents = events.filter((e) => e.status === "completed");

// 	const renderEventSlider = (title, eventList) =>
// 		eventList.length > 0 && (
// 			<Box sx={{ my: 5 }}>
// 				<Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
// 					{title}
// 				</Typography>
// 				<ScrollMenu>
// 					{eventList.map((event) => (
// 						<Box key={event._id} itemId={event._id} m="0 15px">
// 							<Paper
// 								elevation={6}
// 								sx={{
// 									width: "350px",
// 									height: "350px",
// 									display: "flex",
// 									flexDirection: "column",
// 									alignItems: "center",
// 									justifyContent: "center",
// 									backgroundColor: "rgba(255, 255, 255, 0.9)",
// 									color: "#333",
// 									borderRadius: 4,
// 									padding: 3,
// 									cursor: "pointer",
// 									transition: "transform 0.3s ease, box-shadow 0.3s ease",
// 									"&:hover": { transform: "scale(1.05)", boxShadow: 8 },
// 								}}
// 								onDoubleClick={() => handleDoubleClick(event._id)}
// 							>
// 								<Box
// 									sx={{
// 										width: "240px",
// 										height: "240px",
// 										borderRadius: 2,
// 										mb: 1,
// 										overflow: "hidden",
// 										mx: "auto",
// 										position: "relative",
// 										bgcolor: "grey.100", // Add background color for visibility
// 									}}
// 								>
// 									<Box
// 										component="img"
// 										src={`/api/events/poster/${event._id}`}
// 										alt={`${event.name} Poster`}
// 										sx={{
// 											width: "100%",
// 											height: "100%",
// 											objectFit: "cover",
// 											position: "absolute",
// 											top: 0,
// 											left: 0,
// 										}}
// 										onError={(e) => {
// 											e.target.onerror = null;
// 											e.target.src = "/fallback-image.jpg";
// 										}}
// 										loading="lazy"
// 									/>
// 								</Box>
// 								<Typography variant="h6" sx={{ fontWeight: "bold" }}>
// 									{event.name}
// 								</Typography>
// 								{/* <Typography variant="body2" sx={{ textAlign: "center" }}>
// 									{event.description.length > 25 ? event.description.substring(0, 25) + "..." : event.description}
// 								</Typography> */}
// 								<Typography variant="body2" sx={{ textAlign: "center" }}>
// 									{event.type}
// 								</Typography>
// 								<Typography variant="body2" sx={{ textAlign: "center" }}>
// 									{formatDateForInput(event.date)}
// 								</Typography>
// 							</Paper>
// 						</Box>
// 					))}
// 				</ScrollMenu>
// 			</Box>
// 		);

// 	return (
// 		<Box
// 			sx={{
// 				minHeight: "100vh",
// 				background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
// 				color: "white",
// 				display: "flex",
// 				flexDirection: "column",
// 				alignItems: "center",
// 				justifyContent: "flex-start",
// 				padding: 4,
// 			}}
// 		>
// 			<Container maxWidth="lg">
// 				{user && (
// 					<>
// 						<Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
// 							Welcome, {user.email} ({role})
// 						</Typography>

// 						<Grid container justifyContent="center" spacing={2} sx={{ mb: 4 }}>
// 							<Grid item>
// 								<Button variant="contained" color="secondary" onClick={handleDashboardRedirect}>
// 									Visit Dashboard
// 								</Button>
// 							</Grid>

// 							<Grid item>
// 								<Button variant="outlined" color="inherit" onClick={() => navigate(`${role}/results`)}>
// 									View All Results
// 								</Button>
// 							</Grid>
// 						</Grid>
// 					</>
// 				)}

// 				{events.length === 0 ? (
// 					<Typography variant="h6" sx={{ textAlign: "center", fontStyle: "italic", mt: 4 }}>
// 						No Events Found
// 					</Typography>
// 				) : (
// 					<>
// 						{renderEventSlider("Open Events", openEvents)}
// 						{renderEventSlider("Ongoing Events", ongoingEvents)}
// 						{renderEventSlider("Completed Events", completedEvents)}
// 					</>
// 				)}
// 			</Container>
// 		</Box>
// 	);
// };

// export default HomePage;

import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Typography, Paper, Box, Button, Grid, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getEvents } from "../../hooks/useEvents.js";
import { useEventStore } from "../../store/event.js";
import { formatDateForInput } from "../../utils/dateFormat.jsx";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const HomePage = () => {
	const navigate = useNavigate();
	const { user, role } = useContext(AuthContext);
	const { events } = getEvents();
	const { getPoster } = useEventStore();
	const scrollRefs = useRef({});
	const [autoScroll, setAutoScroll] = useState(true);
	const intervalRef = useRef(null);

	// Sort events by date (newest first)
	const sortEventsByDate = (events) => {
		return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
	};

	// Filter and sort events
	const openEvents = sortEventsByDate(events.filter((e) => e.status === "open"));
	const ongoingEvents = sortEventsByDate(events.filter((e) => e.status === "ongoing"));
	const completedEvents = sortEventsByDate(events.filter((e) => e.status === "completed"));

	const handleDoubleClick = (eventId) => {
		const basePath = role === "student" ? "/student/event" : "/event";
		navigate(`${basePath}/${eventId}`);
	};

	const handleDashboardRedirect = () => {
		if (role === "admin") navigate("/admin/home");
		else if (role === "teacher") navigate("/teacher/home");
		else if (role === "student") navigate("/student/dashboard");
	};

	// Auto-scroll functionality
	const startAutoScroll = (ref, containerId) => {
		if (!autoScroll) return;

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			if (ref.current) {
				ref.current.scrollLeft += 1;
				// Reset to start when reaching end
				if (ref.current.scrollLeft >= ref.current.scrollWidth - ref.current.clientWidth) {
					ref.current.scrollLeft = 0;
				}
			}
		}, 30);
	};

	const stopAutoScroll = () => {
		clearInterval(intervalRef.current);
	};

	useEffect(() => {
		return () => {
			clearInterval(intervalRef.current);
		};
	}, []);

	const renderEventCarousel = (title, eventList) => {
		if (eventList.length === 0) return null;

		const containerId = `${title.replace(/\s+/g, "-").toLowerCase()}-carousel`;
		scrollRefs.current[containerId] = scrollRefs.current[containerId] || React.createRef();

		return (
			<Box sx={{ my: 5 }}>
				<Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "white" }}>
					{title}
				</Typography>
				<Box sx={{ position: "relative" }}>
					<Box
						ref={scrollRefs.current[containerId]}
						sx={{
							display: "flex",
							overflowX: "auto",
							scrollBehavior: "smooth",
							scrollSnapType: "x mandatory",
							"&::-webkit-scrollbar": { display: "none" },
							msOverflowStyle: "none",
							scrollbarWidth: "none",
							py: 2,
							gap: 3,
						}}
						onMouseEnter={() => {
							stopAutoScroll();
							setAutoScroll(false);
						}}
						onMouseLeave={() => {
							setAutoScroll(true);
							startAutoScroll(scrollRefs.current[containerId], containerId);
						}}
					>
						{eventList.map((event) => (
							<Box key={event._id} sx={{ minWidth: "350px", flexShrink: 0 }}>
								<Paper
									elevation={6}
									sx={{
										width: "350px",
										height: "350px",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "rgba(255, 255, 255, 0.9)",
										color: "#333",
										borderRadius: 4,
										padding: 3,
										cursor: "pointer",
										transition: "transform 0.3s ease, box-shadow 0.3s ease",
										"&:hover": { transform: "scale(1.05)", boxShadow: 8 },
									}}
									onDoubleClick={() => handleDoubleClick(event._id)}
								>
									<Box
										sx={{
											width: "240px",
											height: "240px",
											borderRadius: 2,
											mb: 1,
											overflow: "hidden",
											mx: "auto",
											position: "relative",
											bgcolor: "grey.100",
										}}
									>
										<Box
											component="img"
											src={`/api/events/poster/${event._id}`}
											alt={`${event.name} Poster`}
											sx={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												position: "absolute",
												top: 0,
												left: 0,
											}}
											onError={(e) => {
												e.target.onerror = null;
												e.target.src = "/fallback-image.jpg";
											}}
											loading="lazy"
										/>
									</Box>
									<Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
										{event.name}
									</Typography>
									<Typography variant="body2" sx={{ textAlign: "center" }}>
										{event.type}
									</Typography>
									<Typography variant="body2" sx={{ textAlign: "center", fontWeight: 500 }}>
										{formatDateForInput(event.date)}
									</Typography>
								</Paper>
							</Box>
						))}
					</Box>

					{/* Navigation arrows */}
					{eventList.length > 3 && (
						<>
							<IconButton
								sx={{
									position: "absolute",
									left: -20,
									top: "50%",
									transform: "translateY(-50%)",
									backgroundColor: "rgba(255,255,255,0.7)",
									"&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
								}}
								onClick={() => {
									scrollRefs.current[containerId].current.scrollLeft -= 400;
								}}
							>
								<ChevronLeft />
							</IconButton>
							<IconButton
								sx={{
									position: "absolute",
									right: -20,
									top: "50%",
									transform: "translateY(-50%)",
									backgroundColor: "rgba(255,255,255,0.7)",
									"&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
								}}
								onClick={() => {
									scrollRefs.current[containerId].current.scrollLeft += 400;
								}}
							>
								<ChevronRight />
							</IconButton>
						</>
					)}
				</Box>
			</Box>
		);
	};

	// Start auto-scroll when component mounts
	useEffect(() => {
		Object.keys(scrollRefs.current).forEach((key) => {
			startAutoScroll(scrollRefs.current[key], key);
		});
	}, [openEvents, ongoingEvents, completedEvents]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
				color: "white",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				padding: 4,
			}}
		>
			<Container maxWidth="lg">
				{user && (
					<>
						<Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
							Welcome, {user.name || user.email} ({role})
						</Typography>

						<Grid container justifyContent="center" spacing={2} sx={{ mb: 4 }}>
							<Grid item>
								<Button
									variant="contained"
									color="secondary"
									onClick={handleDashboardRedirect}
									sx={{ fontWeight: 600 }}
								>
									Visit Dashboard
								</Button>
							</Grid>

							<Grid item>
								<Button
									variant="outlined"
									color="inherit"
									onClick={() => navigate(`${role}/results`)}
									sx={{ fontWeight: 600 }}
								>
									View All Results
								</Button>
							</Grid>
						</Grid>
					</>
				)}

				{events.length === 0 ? (
					<Typography variant="h6" sx={{ textAlign: "center", fontStyle: "italic", mt: 4 }}>
						No Events Found
					</Typography>
				) : (
					<>
						{renderEventCarousel("Open Events", openEvents)}
						{renderEventCarousel("Ongoing Events", ongoingEvents)}
						{renderEventCarousel("Completed Events", completedEvents)}
					</>
				)}
			</Container>
		</Box>
	);
};

export default HomePage;
