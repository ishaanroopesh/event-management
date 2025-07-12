// src/layouts/StudentLayout.jsx
import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import StudentSidebar from "../components/StudentSidebar";

const StudentLayout = () => {
	return (
		<div style={{ display: "flex" }}>
			<StudentSidebar />
			<Container style={{ marginLeft: "175px", padding: "20px", marginRight: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Student Dashboard
				</Typography>
				{/* This is where the child routes (like events, participants, evaluators) will be rendered */}
				<Outlet />
			</Container>
		</div>
	);
};

export default StudentLayout;
