// import React, { useContext, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// import { AuthContext } from "./AuthContext";
// import { CircularProgress, Box } from "@mui/material";

// const AuthCallback = () => {
// 	const navigate = useNavigate();
// 	const [searchParams] = useSearchParams();
// 	const { login } = useContext(AuthContext);

// 	useEffect(() => {
// 		// Extract token from URL (Google redirects to /auth/callback?token=...)
// 		const token = searchParams.get("token");

// 		if (token) {
// 			login(token); // Store token & update user state
// 		} else {
// 			navigate("/login");
// 		}
// 	}, [navigate, searchParams, login]);

// 	return (
// 		<Box
// 			sx={{
// 				display: "flex",
// 				justifyContent: "center",
// 				alignItems: "center",
// 				minHeight: "100vh", // Ensure it takes up the full viewport height
// 			}}
// 		>
// 			{<CircularProgress color="white" />}
// 		</Box>
// 	);
// };

// export default AuthCallback;

import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { CircularProgress, Box } from "@mui/material";

const AuthCallback = () => {
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	useEffect(() => {
		if (token) {
			login(token); // Store token & update user state
		} else {
			navigate("/login");
		}
	}, [navigate, token, login]);

	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
			<CircularProgress color="inherit" />
		</Box>
	);
};

export default AuthCallback;
