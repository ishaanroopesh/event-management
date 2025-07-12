// // src/layouts/EvaluatorLayout.jsx
// import { Box, Container } from "@mui/material";
// import Sidebar from "../components/Sidebar";

// const EvaluatorLayout = ({ children }) => {
// 	return (
// 		<Box display="flex">
// 			<Sidebar role="evaluator" />
// 			<Container sx={{ marginLeft: "175px", padding: "20px", marginRight: "20px" }}>{children}</Container>
// 		</Box>
// 	);
// };

// export default EvaluatorLayout;

import { Outlet } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

const TeacherLayout = () => {
	return (
		<div style={{ display: "flex" }}>
			<Sidebar />
			<Container style={{ marginLeft: "175px", padding: "20px", marginRight: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Teacher Dashboard
				</Typography>
				{/* This is where the child routes (like events, participants, evaluators) will be rendered */}
				<Outlet />
			</Container>
		</div>
	);
};

export default TeacherLayout;
