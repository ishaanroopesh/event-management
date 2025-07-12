import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Avatar,
	Divider,
	useTheme,
	Box,
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import {
	Home as HomeIcon,
	Event as EventIcon,
	People as PeopleIcon,
	School as SchoolIcon,
	Assessment as AssessmentIcon,
	AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

const Sidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, role, logout } = useContext(AuthContext);
	const theme = useTheme();

	const menuItems = {
		admin: [
			{ text: "Home", path: "/admin/home", icon: <HomeIcon /> },
			{ text: "Events", path: "/admin/events", icon: <EventIcon /> },
			{ text: "Teachers", path: "/admin/teachers", icon: <PeopleIcon /> },
			{ text: "Students", path: "/admin/students", icon: <SchoolIcon /> },
			{ text: "Results", path: "/admin/results", icon: <AssessmentIcon /> },
		],
		teacher: [
			{ text: "Home", path: "/teacher", icon: <HomeIcon /> },
			{ text: "Events", path: "/teacher/events", icon: <EventIcon /> },
			{ text: "Teachers", path: "/teacher/teachers", icon: <PeopleIcon /> },
			{ text: "Students", path: "/teacher/students", icon: <SchoolIcon /> },
			{ text: "Results", path: "/teacher/results", icon: <AssessmentIcon /> },
		],
	};

	const isActive = (path) => {
		return location.pathname === path || location.pathname.startsWith(`${path}/`);
	};

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: 100,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: 240,
					boxSizing: "border-box",
					backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.background.default,
					borderRight: "none",
					marginTop: "64px", // Match navbar height
				},
			}}
		>
			<Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Avatar
					sx={{
						width: 64,
						height: 64,
						mb: 1,
						bgcolor: theme.palette.primary.main,
						fontSize: "1.5rem",
					}}
				>
					{user?.name?.charAt(0)?.toUpperCase()}
				</Avatar>
				<Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
					{user?.name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{role?.toUpperCase()}
				</Typography>
			</Box>

			<Divider />

			<List sx={{ p: 1 }}>
				{menuItems[role]?.map((item) => (
					<ListItem key={item.text} disablePadding>
						<ListItemButton
							selected={isActive(item.path)}
							onClick={() => navigate(item.path)}
							sx={{
								borderRadius: 1,
								"&.Mui-selected": {
									backgroundColor:
										theme.palette.mode === "light" ? "rgba(25, 118, 210, 0.12)" : "rgba(144, 202, 249, 0.12)",
									color: theme.palette.primary.main,
									"& .MuiListItemIcon-root": {
										color: theme.palette.primary.main,
									},
								},
								"&:hover": {
									backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
								},
							}}
						>
							<ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Divider sx={{ my: 1 }} />
		</Drawer>
	);
};

export default Sidebar;
