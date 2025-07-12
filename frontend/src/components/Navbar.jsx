import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import { Box, ThemeProvider, createTheme, styled } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

// Styled components for better customization
const StyledLink = styled(Link)(({ theme }) => ({
	textDecoration: "none",
	color: "inherit",
	display: "flex",
	alignItems: "center",
	marginRight: theme.spacing(2),
}));

const NavButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(0, 1),
	fontWeight: 500,
	"&:hover": {
		backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
	},
}));

const Navbar = () => {
	const [mode, setMode] = React.useState("light");
	const { user, role, logout } = useContext(AuthContext);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const theme = createTheme({
		palette: {
			mode,
			primary: {
				main: mode === "light" ? "#1976d2" : "#90caf9",
			},
		},
		shape: {
			borderRadius: 8,
		},
	});

	const toggleColorMode = () => {
		setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	};

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar sx={{ minHeight: 64 }}>
					<StyledLink to="/">
						<Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
							CMRIT
						</Typography>
					</StyledLink>

					<Box sx={{ flexGrow: 1 }} />

					<Box sx={{ display: "flex", alignItems: "center" }}>
						{user === null && (
							<NavButton color="inherit" component={Link} to={"http://localhost:2222/auth/google"} variant="outlined">
								Login
							</NavButton>
						)}

						{user !== null && (
							<>
								<NavButton color="inherit" component={Link} to="/ai-chat">
									AI Assistant
								</NavButton>
								{/* Role-based buttons */}
								{(role === "admin" || role === "teacher") && (
									<NavButton color="inherit" component={Link} to={`/${role}/event/create`}>
										Create Event
									</NavButton>
								)}
								{role === "admin" && (
									<NavButton color="inherit" component={Link} to="/admin">
										Admin Dashboard
									</NavButton>
								)}
								{role === "teacher" && (
									<NavButton color="inherit" component={Link} to="/teacher">
										Teacher Dashboard
									</NavButton>
								)}
								{role === "student" && (
									<NavButton color="inherit" component={Link} to="/student">
										My Dashboard
									</NavButton>
								)}{" "}
								<Button color="inherit" onClick={logout}>
									{" "}
									Logout
								</Button>
								{/* Theme toggle button */}
								<IconButton
									color="inherit"
									onClick={toggleColorMode}
									sx={{
										ml: 1,
										"&:hover": {
											backgroundColor:
												theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
										},
									}}
								>
									{mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
								</IconButton>
							</>
						)}
					</Box>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
};

export default Navbar;
