// // src/layouts/AdminLayout.jsx
// import { Box, Container } from "@mui/material";
// import Sidebar from "../components/Sidebar";

// const AdminLayout = ({ children }) => {
// 	return (
// 		<Box display="flex">
// 			<Sidebar role="admin" />
// 			<Container sx={{ marginLeft: "175px", padding: "20px", marginRight: "20px" }}>{children}</Container>
// 		</Box>
// 	);
// };

// export default AdminLayout;

import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
	return (
		<div style={{ display: "flex" }}>
			<Sidebar />
			<Container style={{ marginLeft: "175px", padding: "20px", marginRight: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Admin Dashboard
				</Typography>
				{/* This is where the child routes (like events, participants, evaluators) will be rendered */}
				<Outlet />
			</Container>
		</div>
	);
};

export default AdminLayout;
