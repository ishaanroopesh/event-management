// components/Sidebar.jsx
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useStudentStore } from "../store/student";

const StudentSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, role, logout } = useContext(AuthContext);
	const { findStudent } = useStudentStore();
	const [student, setStudent] = useState(null);
	const [loading, setLoading] = useState(true);

	const menuItemsStudent = [
		{ text: "Events", path: "/student/events" },
		{ text: "Registrations", path: "/student/user/registrations" },
		{ text: "Students", path: "/student/student-list" },
		{ text: "Results", path: "/student/results" },
	];

	useEffect(() => {
		const loadStudent = async () => {
			try {
				const response = await findStudent(user.email);
				if (response.success) {
					setStudent(response.data);
					setLoading(false);
				} else {
					console.error(response.message);
				}
			} catch (error) {
				console.error("Failed to load student data.", error);
			}
		};
		loadStudent();
	}, [user.email, findStudent]); // `findStudent` is re-created on every render

	return (
		!loading && (
			<Drawer
				variant="permanent"
				sx={{
					flexShrink: 0,
					"& .MuiDrawer-paper": { width: 150, marginTop: { xs: "74px", m: "64px" }, paddingTop: "75px" }, // Adjust for navbar height
				}}
			>
				<List>
					<ListItem>
						<Typography
							variant="h5"
							component={Link}
							to="/student"
							sx={{
								textDecoration: "none",
								color: "inherit",
							}}
						>
							{student.name}
						</Typography>
					</ListItem>
					{menuItemsStudent.map((item) => (
						<ListItem button key={item.text} onClick={() => navigate(item.path)}>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
				</List>
			</Drawer>
		)
	);
};

export default StudentSidebar;
