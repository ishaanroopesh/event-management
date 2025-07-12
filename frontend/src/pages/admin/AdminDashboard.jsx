import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
	return (
		<div style={{ display: "flex" }}>
			<Sidebar />
			<Container style={{ marginLeft: "175px", padding: "20px", marginRight: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Admin Dashboard
				</Typography>
				{/* Render child routes */}
				<Outlet />
			</Container>
		</div>
	);
};

export default AdminDashboard;
