import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = ({ sx }) => {
	const navigate = useNavigate();

	return (
		<Button
			variant="outlined"
			startIcon={<ArrowBackIcon />}
			onClick={() => navigate(-1)}
			sx={{
				m: 2,
				...sx,
				"&:hover": {
					backgroundColor: "#17c", // or 'neutral[100]' or any valid color from your theme
				},
			}}
			color="neutral"
		>
			Back
		</Button>
	);
};

export default BackButton;
