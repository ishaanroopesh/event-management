import { useState } from "react";
import {
	Box,
	Button,
	Modal,
	Typography,
	Stack,
	Paper,
	Autocomplete, // For object name matching
	TextField,
} from "@mui/material";

const AddEvaluatorModal = ({ eventId, availableTeachers, onAddEvaluator, onClose }) => {
	const [selectedTeacher, setSelectedTeacher] = useState(null);

	const handleAdd = async () => {
		if (!selectedTeacher || !selectedTeacher._id) return;

		try {
			await onAddEvaluator(selectedTeacher._id); // Pass the ID of the selected teacher
			onClose(); // Close modal on success
		} catch (error) {
			console.error("Error adding evaluator:", error);
		}
	};

	return (
		<Modal open onClose={onClose} aria-labelledby="add-evaluator-modal-title">
			<Box
				component={Paper}
				elevation={4}
				p={4}
				width={{ xs: "90%", sm: 450 }} // Adjusted width for better Autocomplete display
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					borderRadius: 3,
					outline: "none", // Remove default modal outline
				}}
			>
				<Typography variant="h6" id="add-evaluator-modal-title" mb={3} textAlign="center">
					Add Evaluator
				</Typography>

				<Autocomplete
					options={availableTeachers || []}
					getOptionLabel={(teacher) => `${teacher.name} (${teacher.email})`} // display teacher details
					value={selectedTeacher}
					onChange={(event, newValue) => {
						setSelectedTeacher(newValue); // newValue is the selected teacher object or null
					}}
					isOptionEqualToValue={(option, value) => option._id === value?._id} // For object comparison
					fullWidth
					renderInput={(params) => <TextField {...params} label="Search a Teacher" />}
					// When no options are available or match the search
					noOptionsText={(availableTeachers || []).length === 0 ? "No available teachers" : "No teachers found"}
				/>

				<Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
					<Button variant="outlined" onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant="contained"
						disabled={!selectedTeacher || !selectedTeacher._id} // Disable if no teacher is selected
						onClick={handleAdd}
					>
						Add Evaluator
					</Button>
				</Stack>
			</Box>
		</Modal>
	);
};

export default AddEvaluatorModal;
