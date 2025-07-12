import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useStudentStore } from "../../store/student"; // Zustand store for students
import { useTeacherStore } from "../../store/teacher"; // Zustand store for teachers
import { createAdmin } from "../../../../backend/controllers/admin.controller";

const Register = () => {
	const { user, role } = useContext(AuthContext);
	console.log(user.department);
	const navigate = useNavigate();
	const { createStudent } = useStudentStore();
	const { createTeacher } = useTeacherStore();

	// State for newUser
	const [newUser, setNewUser] = useState({
		name: user?.name || "",
		email: user?.email || "",
		department: user?.department || "",
		usn: "",
	});

	// Redirect if user is not authenticated
	useEffect(() => {
		if (!user || !role) navigate("/login");
	}, [user, role, navigate]);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewUser((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (role === "student" && !newUser.usn.trim()) {
			alert("USN is required for students");
			return;
		}

		try {
			if (role === "student") {
				const res = await createStudent({
					name: newUser.name,
					email: newUser.email,
					usn: newUser.usn,
					department: newUser.department,
				});
				if (res.success) navigate("/"); // Redirect after registration
			} else if (role === "teacher") {
				const res = await createTeacher({ name: newUser.name, email: newUser.email, department: newUser.department });
				if (res.success) navigate("/");
			} else if (role === "admin") {
				const res = await createAdmin({ name: newUser.name, email: newUser.email, department: newUser.department });
				if (res.success) navigate("/");
			}
		} catch (error) {
			console.error("Registration error:", error);
			alert("Registration failed. Try again.");
		}
	};

	return (
		<Box display="flex" flexDirection="column" alignItems="center" mt={5}>
			<Typography variant="h5" mb={2}>
				Complete Registration
			</Typography>
			<Box component="form" onSubmit={handleSubmit} width="100%" maxWidth="400px">
				<TextField label="Name" value={newUser.name} fullWidth margin="normal" disabled />
				<TextField label="Email" value={newUser.email} fullWidth margin="normal" disabled />
				<TextField label="Role" value={role} fullWidth margin="normal" disabled />
				{role === "student" && (
					<TextField
						label="USN"
						name="usn"
						value={newUser.usn}
						onChange={handleChange}
						fullWidth
						margin="normal"
						required
					/>
				)}
				{newUser.department && (
					<FormControl fullWidth margin="normal" required>
						<InputLabel>Department</InputLabel>
						<Select name="type" value={newUser.department} onChange={handleChange} label="department" disabled>
							<MenuItem value="CSE">CSE</MenuItem>
							<MenuItem value="ISE">ISE</MenuItem>
							<MenuItem value="ECE">ECE</MenuItem>
							<MenuItem value="AIML">AIML</MenuItem>
							<MenuItem value="AIDS">AIDS</MenuItem>
							<MenuItem value="CSML">CSML</MenuItem>
							<MenuItem value="CSDS">CSDS</MenuItem>
						</Select>
					</FormControl>
				)}
				{newUser.department === null && (
					<FormControl fullWidth margin="normal" required>
						<InputLabel>Department</InputLabel>
						<Select name="type" value={newUser.department} onChange={handleChange} label="department">
							<MenuItem value="CSE">CSE</MenuItem>
							<MenuItem value="ISE">ISE</MenuItem>
							<MenuItem value="ECE">ECE</MenuItem>
							<MenuItem value="AIML">AIML</MenuItem>
							<MenuItem value="AIDS">AIDS</MenuItem>
						</Select>
					</FormControl>
				)}
				<Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
					Register
				</Button>
			</Box>
		</Box>
	);
};

export default Register;
