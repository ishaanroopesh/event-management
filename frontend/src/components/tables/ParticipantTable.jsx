// // components/tables/ParticipantTable.jsx
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import { useParticipantStore } from "../../store/participant";
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";

// const ParticipantTable = () => {
// 	const { eventId } = useParams();
// 	const { fetchParticipantsByEvent } = useParticipantStore();
// 	const [participantList, setParticipantList] = useState([]);

// 	useEffect(() => {
// 		const loadParticipants = async () => {
// 			try {
// 				const participantListData = await fetchParticipantsByEvent(eventId); // Fetch only this event
// 				if (participantListData) {
// 					setParticipantList(participantListData);
// 				} else {
// 					console.error("error");
// 				}
// 			} catch (error) {
// 				console.error("Failed to load event data.");
// 			}
// 		};
// 		loadParticipants();
// 	}, [eventId, fetchParticipantsByEvent]);

// 	return (
// 		<TableContainer component={Paper}>
// 			<Table>
// 				<TableHead>
// 					<TableRow>
// 						<TableCell>Participant Name</TableCell>
// 						<TableCell>Event</TableCell>
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{participantList.map((participant) => (
// 						<TableRow key={participant._id}>
// 							<TableCell>{participant.student?.name || participant.teamName || "Unknown"}</TableCell>
// 							<TableCell>{participant.eventId?.name}</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	);
// };

// export default ParticipantTable;

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Avatar,
	Chip,
	Typography,
	CircularProgress,
	Box,
	useTheme,
} from "@mui/material";
import { useParticipantStore } from "../../store/participant";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";

const ParticipantTable = ({ showEventColumn = false }) => {
	const { eventId } = useParams();
	const { fetchParticipantsByEvent } = useParticipantStore();
	const [participantList, setParticipantList] = useState([]);
	const [loading, setLoading] = useState(true);
	const theme = useTheme();

	useEffect(() => {
		const loadParticipants = async () => {
			try {
				setLoading(true);
				const participantListData = await fetchParticipantsByEvent(eventId);
				setParticipantList(participantListData || []);
			} catch (error) {
				console.error("Failed to load participant data:", error);
			} finally {
				setLoading(false);
			}
		};
		loadParticipants();
	}, [eventId, fetchParticipantsByEvent]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress size={24} />
			</Box>
		);
	}

	if (participantList.length === 0) {
		return (
			<Paper sx={{ p: 2, textAlign: "center" }}>
				<Typography color="textSecondary">No participants found</Typography>
			</Paper>
		);
	}

	return (
		<TableContainer
			component={Paper}
			sx={{
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Table>
				<TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
					<TableRow>
						<TableCell sx={{ fontWeight: 600 }}>Participant</TableCell>
						{showEventColumn && <TableCell sx={{ fontWeight: 600 }}>Event</TableCell>}
						<TableCell sx={{ fontWeight: 600 }} align="right">
							Type
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{participantList.map((participant) => {
						const isTeam = !!participant.team;
						const displayName = participant.student?.name || participant.teamName || "Unknown";

						return (
							<TableRow
								key={participant._id}
								hover
								sx={{
									"&:last-child td": { borderBottom: 0 },
									"&:hover": {
										backgroundColor: theme.palette.action.hover,
									},
								}}
							>
								<TableCell>
									<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
										<Avatar
											sx={{
												width: 36,
												height: 36,
												bgcolor: isTeam ? theme.palette.secondary.light : theme.palette.primary.light,
											}}
										>
											{isTeam ? <GroupIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
										</Avatar>
										<Typography fontWeight={500}>{displayName}</Typography>
									</Box>
								</TableCell>

								{showEventColumn && (
									<TableCell>
										<Typography variant="body2">{participant.eventId?.name || "N/A"}</Typography>
									</TableCell>
								)}

								<TableCell align="right">
									<Chip
										label={isTeam ? "Team" : "Individual"}
										size="small"
										color={isTeam ? "secondary" : "primary"}
										variant="outlined"
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ParticipantTable;
