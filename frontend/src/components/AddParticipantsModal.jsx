import { useState, useMemo } from "react";
import {
	Box,
	Button,
	Modal,
	Typography,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	Divider,
	Avatar,
	Chip,
	Paper,
	InputAdornment,
	TextField,
	Tooltip,
	useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";

const AddParticipantsModal = ({ evaluators, selectedEvaluatorId, participants, onAssign, onClose }) => {
	const theme = useTheme();
	const [selectedEvaluator, setSelectedEvaluator] = useState(selectedEvaluatorId);
	const [selectedParticipants, setSelectedParticipants] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [lastAction, setLastAction] = useState(null); // Track last bulk action

	const filteredParticipants = useMemo(() => {
		return participants.filter((p) => {
			const searchLower = searchTerm.toLowerCase();
			const name = p.student?.name || p.teamName || "Unnamed";
			const email = p.student?.email || p.team?.map((m) => m.email).join(", ") || "";
			return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower);
		});
	}, [participants, searchTerm]);

	const handleToggleParticipant = (participantId) => {
		setSelectedParticipants((prev) =>
			prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId]
		);
		setLastAction("toggle");
	};

	const handleSelectAll = () => {
		const newSelection =
			selectedParticipants.length === filteredParticipants.length ? [] : filteredParticipants.map((p) => p._id);
		setSelectedParticipants(newSelection);
		setLastAction(newSelection.length ? "selectAll" : "deselectAll");
	};

	const handleSelectHalf = () => {
		const halfCount = Math.ceil(filteredParticipants.length / 2);
		const newSelection = filteredParticipants.slice(0, halfCount).map((p) => p._id);
		setSelectedParticipants(newSelection);
		setLastAction("selectHalf");
	};

	const handleAssign = () => {
		if (selectedParticipants.length > 0 && selectedEvaluator) {
			onAssign(selectedEvaluator, selectedParticipants);
			setSelectedParticipants([]);
			onClose();
		}
	};

	// Animation effect for visual feedback
	const getSelectionStyle = (participantId) => {
		const isSelected = selectedParticipants.includes(participantId);
		const baseStyle = {
			backgroundColor: isSelected ? theme.palette.action.selected : "transparent",
			transition: "all 0.3s ease",
		};

		if (lastAction && isSelected) {
			return {
				...baseStyle,
				transform: "scale(1.02)",
				boxShadow: theme.shadows[2],
				backgroundColor: theme.palette.action.hover,
			};
		}
		return baseStyle;
	};

	return (
		<Modal open onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: { xs: "90%", md: "80%", lg: "70%" },
					maxWidth: 1000,
					maxHeight: "90vh",
					bgcolor: "background.paper",
					borderRadius: 2,
					boxShadow: 24,
					p: 3,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<Typography variant="h5" component="h2" mb={2} sx={{ fontWeight: 600 }}>
					Assign Participants to Evaluator
				</Typography>

				<Box sx={{ mb: 2 }}>
					<TextField
						fullWidth
						placeholder="Search participants..."
						variant="outlined"
						size="small"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</Box>

				<Box
					sx={{
						display: "flex",
						gap: 3,
						flexGrow: 1,
						overflow: "hidden",
						height: "100%",
					}}
				>
					{/* Evaluators Panel */}
					<Paper
						elevation={2}
						sx={{
							flex: 1,
							p: 2,
							borderRadius: 2,
							overflow: "auto",
							minWidth: 250,
						}}
					>
						<Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
							Evaluators
							<Chip label={`${evaluators.length} available`} size="small" sx={{ ml: 1 }} />
						</Typography>
						<Divider sx={{ mb: 2 }} />

						<List dense sx={{ p: 0 }}>
							{evaluators.map((ev) => (
								<ListItem
									key={ev._id}
									onClick={() => setSelectedEvaluator(ev._id)}
									sx={{
										cursor: "pointer",
										borderRadius: 1,
										backgroundColor: selectedEvaluator === ev._id ? theme.palette.primary.light : "transparent",
										color: selectedEvaluator === ev._id ? theme.palette.primary.contrastText : "inherit",
										"&:hover": {
											backgroundColor:
												selectedEvaluator === ev._id ? theme.palette.primary.main : theme.palette.action.hover,
										},
										transition: "all 0.2s ease",
										mb: 0.5,
									}}
								>
									<Avatar
										sx={{
											width: 32,
											height: 32,
											mr: 2,
											bgcolor: selectedEvaluator === ev._id ? theme.palette.primary.dark : theme.palette.grey[400],
										}}
									>
										{ev.teacherId?.name?.charAt(0) || "E"}
									</Avatar>
									<ListItemText
										primary={ev.teacherId?.name}
										secondary={ev.teacherId?.email}
										primaryTypographyProps={{ fontWeight: 500 }}
									/>
								</ListItem>
							))}
						</List>
					</Paper>

					{/* Participants Panel */}
					<Paper
						elevation={2}
						sx={{
							flex: 2,
							p: 2,
							borderRadius: 2,
							overflow: "auto",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 1,
							}}
						>
							<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
								Unassigned Participants
								<Chip label={`${filteredParticipants.length} found`} size="small" sx={{ ml: 1 }} />
							</Typography>

							<Box sx={{ display: "flex", gap: 1 }}>
								{selectedParticipants.length > 0 && (
									<Chip label={`${selectedParticipants.length} selected`} color="primary" size="small" sx={{ mr: 1 }} />
								)}
								<Button
									variant={selectedParticipants.length === filteredParticipants.length ? "contained" : "outlined"}
									size="small"
									onClick={handleSelectAll}
									disabled={filteredParticipants.length === 0}
								>
									Select All
								</Button>
								<Button
									variant={selectedParticipants.length === filteredParticipants.length / 2 ? "contained" : "outlined"}
									// variant="outlined"
									size="small"
									onClick={handleSelectHalf}
									disabled={filteredParticipants.length === 0}
								>
									Select Half
								</Button>
							</Box>
						</Box>
						<Divider sx={{ mb: 2 }} />

						<List dense sx={{ p: 0, flexGrow: 1, overflow: "auto" }}>
							{filteredParticipants.length > 0 ? (
								filteredParticipants.map((p) => {
									const isTeam = !!p.team;
									const displayName = p.student?.name || p.teamName || "Unnamed";
									const secondary = p.student?.email || (p.team?.map((m) => m.email).join(", ") ?? "");

									return (
										<ListItem
											key={p._id}
											sx={{
												cursor: "pointer",
												borderRadius: 1,
												...getSelectionStyle(p._id),
												"&:hover": {
													backgroundColor: theme.palette.action.hover,
												},
												mb: 0.5,
											}}
											onClick={() => handleToggleParticipant(p._id)}
										>
											<Checkbox
												checked={selectedParticipants.includes(p._id)}
												edge="start"
												sx={{ mr: 1 }}
												color="primary"
											/>
											<Avatar
												sx={{
													width: 32,
													height: 32,
													mr: 2,
													bgcolor: isTeam ? theme.palette.secondary.main : theme.palette.info.main,
												}}
											>
												{isTeam ? <GroupIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
											</Avatar>
											<ListItemText
												primary={
													<Box sx={{ display: "flex", alignItems: "center" }}>
														<span>{displayName}</span>
														{isTeam && <Chip label={`${p.team?.length || 0} members`} size="small" sx={{ ml: 1 }} />}
													</Box>
												}
												secondary={secondary}
												primaryTypographyProps={{ fontWeight: 500 }}
												secondaryTypographyProps={{ noWrap: true }}
											/>
										</ListItem>
									);
								})
							) : (
								<Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", mt: 4 }}>
									{searchTerm ? "No matching participants found" : "No unassigned participants available"}
								</Typography>
							)}
						</List>
					</Paper>
				</Box>

				{/* Actions */}
				<Box
					sx={{
						mt: 3,
						display: "flex",
						justifyContent: "flex-end",
						gap: 2,
					}}
				>
					<Button variant="outlined" onClick={onClose} sx={{ minWidth: 100 }}>
						Cancel
					</Button>
					<Tooltip
						title={
							!selectedEvaluator
								? "Please select an evaluator"
								: selectedParticipants.length === 0
								? "Please select at least one participant"
								: ""
						}
					>
						<span>
							<Button
								variant="contained"
								onClick={handleAssign}
								disabled={selectedParticipants.length === 0 || !selectedEvaluator}
								sx={{ minWidth: 100 }}
							>
								Assign {selectedParticipants.length > 0 ? `(${selectedParticipants.length})` : ""}
							</Button>
						</span>
					</Tooltip>
				</Box>
			</Box>
		</Modal>
	);
};

export default AddParticipantsModal;
