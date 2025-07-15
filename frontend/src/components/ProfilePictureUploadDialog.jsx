import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	Alert,
	Avatar,
	CircularProgress,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useStudentStore } from "../store/student";

const ProfilePictureUploadDialog = ({ open, onClose, studentId, onUploadSuccess }) => {
	const { uploadProfilePicture } = useStudentStore();
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Reset state when dialog closes
	const handleClose = () => {
		setFile(null);
		setPreview(null);
		setLoading(false);
		setError("");
		onClose(); // parent onClose handler
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (!selectedFile) return;

		if (!selectedFile.type.startsWith("image/")) {
			setError("Please select a valid image file.");
			setFile(null);
			setPreview(null);
			return;
		}

		// (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5 MB
		if (selectedFile.size > maxSize) {
			setError("File size exceeds 5MB limit.");
			setFile(null);
			setPreview(null);
			return;
		}

		setFile(selectedFile);
		setPreview(URL.createObjectURL(selectedFile));
		setError("");
	};

	const handleUpload = async () => {
		if (!file) {
			setError("Please select a file to upload.");
			return;
		}
		if (!studentId) {
			setError("Student ID is missing. Cannot upload.");
			return;
		}

		setLoading(true);
		setError("");

		// uploadProfilePicture will create FormData
		const res = await uploadProfilePicture(studentId, file);
		setLoading(false);

		if (res.success) {
			// Call the success callback
			onUploadSuccess?.();
			handleClose(); // Close the dialog
		} else {
			setError(res.message || "Upload failed. Please try again.");
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
			<DialogTitle sx={{ fontWeight: 600 }}>Upload Profile Picture</DialogTitle>
			<DialogContent dividers>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Typography gutterBottom>
					Select an image file (JPEG/PNG) to upload. It will be resized to 300x300 pixels.
				</Typography>

				<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
					<Avatar
						src={preview} // selected image preview
						sx={{ width: 120, height: 120 }}
						variant="circular"
					/>
				</Box>

				<Box sx={{ textAlign: "center" }}>
					<Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
						Choose File
						<input type="file" hidden accept="image/*" onChange={handleFileChange} />
					</Button>
					{file && (
						<Typography variant="body2" sx={{ mt: 1, wordBreak: "break-all" }}>
							Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
						</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button onClick={handleClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleUpload} variant="contained" disabled={loading || !file}>
					{loading ? <CircularProgress size={24} /> : "Upload"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProfilePictureUploadDialog;
