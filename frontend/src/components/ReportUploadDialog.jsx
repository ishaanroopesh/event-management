import React, { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Box,
	Typography,
	CircularProgress,
	Alert,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useEventStore } from "../store/event.js"; // Assuming your zustand store has the upload function

const ReportUploadDialog = ({ open, onClose, eventId, onSuccess }) => {
	const { uploadEventReport } = useEventStore();
	const [summary, setSummary] = useState("");
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setError(""); // Clear previous errors
		}
	};

	const handleClose = () => {
		// Reset state on close
		setSummary("");
		setFile(null);
		setError("");
		setLoading(false);
		onClose();
	};

	const handleUpload = async () => {
		if (!file || !summary) {
			// handle error
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append("file", file); // 'file' must match the backend
		formData.append("summary", summary);

		// Call the new function from your Zustand store
		const result = await uploadEventReport(eventId, formData);

		setLoading(false);

		if (result.success) {
			onSuccess(); // calls the success handler passed from EventDetailPage
		} else {
			setError(result.message);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 600 }}>Upload Event Report</DialogTitle>
			<DialogContent dividers>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<Typography gutterBottom>Please provide a brief summary and the final report file for the event.</Typography>
				<TextField
					autoFocus
					margin="dense"
					id="summary"
					label="Report Summary"
					type="text"
					fullWidth
					multiline
					rows={4}
					variant="outlined"
					value={summary}
					onChange={(e) => setSummary(e.target.value)}
					sx={{ mb: 2 }}
				/>
				<Box sx={{ border: "1px dashed grey", borderRadius: 1, p: 2, textAlign: "center" }}>
					<Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
						Select Report File
						<input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx" />
					</Button>
					{file && (
						<Typography variant="body2" sx={{ mt: 1 }}>
							Selected: {file.name}
						</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={handleClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleUpload} variant="contained" disabled={loading}>
					{loading ? <CircularProgress size={24} /> : "Upload"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ReportUploadDialog;
