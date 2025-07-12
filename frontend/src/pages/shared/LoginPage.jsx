import React from "react";
import { Container, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
	const theme = useTheme();

	return (
		<Container
			maxWidth={false}
			disableGutters
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				color: "#fff",
			}}
		>
			<div>
				<Typography variant="h3" fontWeight="bold" gutterBottom>
					Welcome to CMRIT Events
				</Typography>
				<Typography variant="h6" sx={{ mb: 4 }}>
					Sign in with your CMRIT email to continue
				</Typography>

				<Link to={"http://localhost:2222/auth/google"}>
					<Button
						variant="contained"
						color="secondary"
						sx={{
							px: 6,
							py: 1.5,
							fontSize: "1rem",
							fontWeight: 600,
							borderRadius: 10,
							boxShadow: 4,
							"&:hover": {
								backgroundColor: "#1abc9c",
							},
						}}
					>
						Login with Google
					</Button>
				</Link>
			</div>
		</Container>
	);
};

export default LoginPage;
