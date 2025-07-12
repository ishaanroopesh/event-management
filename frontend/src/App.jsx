import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/shared/HomePage";
import AuthCallback from "./context/AuthCallback.jsx";
import LoginPage from "./pages/shared/LoginPage.jsx";
import ProtectedRoute from "./services/ProtectedRoute.jsx";
import AdminLayout from "./layouts/AdminLayout";
import TeacherLayout from "./layouts/TeacherLayout.jsx";
import StudentLayout from "./layouts/StudentLayout";
import ParticipantTable from "./components/tables/ParticipantTable";
import StudentTable from "./components/tables/StudentTable";
import EventCreatePage from "./pages/admin/EventCreatePage.jsx";
import EventUpdatePage from "./pages/admin/EventUpdatePage.jsx";
import EventDetailPage from "./pages/shared/EventDetailPage.jsx";
import EventCard from "./components/tables/EventCard.jsx";
import ManageEvaluators from "./pages/admin/ManageEvaluators.jsx";
import AddEvaluatorModal from "./components/AddEvaluatorModal.jsx";
import TeacherTable from "./components/tables/TeacherTable.jsx";
import TeacherDetails from "./pages/admin/TeacherDetails.jsx";
import StudentDetails from "./pages/admin/StudentDetails.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import ViewEvaluators from "./pages/teacher/ViewEvaluators.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import StudentEventDetail from "./pages/student/StudentEventDetail.jsx";
import StudentRegistrations from "./pages/student/StudentRegistrations.jsx";
import ScoreParticipants from "./pages/teacher/ScoreParticipant.jsx";
import StudentScore from "./pages/student/StudentScore.jsx";
import ChatPage from "./pages/shared/ChatPage.jsx";
import ChatBox from "./components/ChatBox.jsx";
import ResultsHomePage from "./pages/shared/ResultsHomePage.jsx";
import EventResultPage from "./pages/shared/EventResultPage.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Register from "./pages/shared/Register.jsx";
import AdminEventCard from "./components/AdminEventCard.jsx";
import EventListPage from "./pages/shared/Events.jsx";

function App() {
	const theme = createTheme({
		components: {
			MuiTextField: {
				styleOverrides: {
					root: {
						backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background
						borderRadius: "5px", // Soft corners
						"& .MuiOutlinedInput-root": {
							input: { color: "black" }, // Ensure text is visible
							// "& fieldset": { borderColor: "#fff" },
							"&:hover fieldset": { borderColor: "#333" },
							// "&.Mui-focused fieldset": { borderColor: "#fff" },
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						color: "black",
						backgroundColor: "white", // White background
						padding: "2px 5px",
						borderRadius: "4px",
						textShadow: "none", // Remove shadow for clarity
					},
				},
			},
			MuiFormLabel: {
				styleOverrides: {
					root: {
						color: "black",
						backgroundColor: "white", // White background
						padding: "2px 5px",
						borderRadius: "4px",
						textShadow: "none", // Remove shadow for clarity
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: {
						color: "black",
						backgroundColor: "white", // White background
						padding: "2px 5px",
						borderRadius: "4px",
						textShadow: "none", // Remove shadow for clarity
					},
				},
			},
		},
	});
	return (
		<>
			<ThemeProvider theme={theme}>
				<Navbar />
				<Box
					sx={{
						minHeight: "100vh",
						background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
						color: "white",
						display: "flex",
						flexDirection: "column",
						flexGrow: 1,
						pt: "80px", // Slightly more than navbar height for breathing room
						height: "calc(100vh - 64px)", // Optional: if you want full viewport height
						overflow: "auto", // Enable scrolling just for content
					}}
				>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/event/:eventId" element={<EventDetailPage />} />
						<Route path="/ai-chat" element={<ChatPage />} />
						<Route path="/event-results/:eventId" element={<EventResultPage />} />

						<Route path="/auth/callback" element={<AuthCallback />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<Register />} />
						{/* <Route path="/ai-chat" element={<ChatBox/>} /> */}

						{/* Admin Routes */}
						<Route
							path="/admin/*"
							element={
								<ProtectedRoute requiredRole="admin">
									<AdminLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<h2>Select a section from the sidebar</h2>} />

							<Route path="home" element={<AdminEventCard />} />
							<Route path="events" element={<EventListPage />} />
							<Route path="event/create" element={<EventCreatePage />} />
							<Route path="event/:eventId" element={<EventDetailPage />} />
							<Route path="event/edit/:eventId" element={<EventUpdatePage />} />

							<Route path="evaluators/:eventId" element={<ManageEvaluators />} />
							<Route path="evaluators/:eventId/add-evaluators" element={<AddEvaluatorModal />} />

							<Route path="students" element={<StudentTable />} />
							<Route path="student-details/:studentId" element={<StudentDetails />} />
							<Route path="student-score/:eventId/:participantId" element={<StudentScore />} />

							<Route path="teachers" element={<TeacherTable />} />
							<Route path="teacher-details/:teacherId" element={<TeacherDetails />} />

							<Route path="results" element={<ResultsHomePage />} />
						</Route>

						{/* Evaluator Routes */}
						<Route
							path="/teacher/*"
							element={
								<ProtectedRoute requiredRole="teacher">
									<TeacherLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<TeacherDashboard />} />

							{/* <Route path="events" element={<EventCard />} /> */}
							<Route path="events" element={<EventListPage />} />
							<Route path="event/:eventId" element={<EventDetailPage />} />
							<Route path="event/create" element={<EventCreatePage />} />
							<Route path="event/edit/:eventId" element={<EventUpdatePage />} />

							<Route path="teachers" element={<TeacherTable />} />
							<Route path="teacher-details/:teacherId" element={<TeacherDetails />} />
							<Route path="view/evaluators/:eventId" element={<ViewEvaluators />} />
							<Route path="manage/evaluators/:eventId" element={<ManageEvaluators />} />

							<Route path=":teacherId/score-participants/:eventId" element={<ScoreParticipants />} />
							<Route path="student-score/:eventId/:participantId" element={<StudentScore />} />

							<Route path="students" element={<StudentTable />} />
							<Route path="student-details/:studentId" element={<StudentDetails />} />

							<Route path="results" element={<ResultsHomePage />} />
						</Route>

						{/* Student Routes */}
						<Route
							path="/student/*"
							element={
								<ProtectedRoute requiredRole="student">
									<StudentLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<StudentDashboard />} />
							<Route path="student-list" element={<StudentTable />} />
							<Route path="user/registrations" element={<StudentRegistrations />} />
							<Route path="student-score/:eventId/:participantId" element={<StudentScore />} />
							<Route path="events" element={<EventListPage />} />
							<Route path="event/:eventId" element={<StudentEventDetail />} />
							<Route path="students" element={<StudentTable />} />
							<Route path="student-details/:studentId" element={<StudentDetails />} />
							<Route path="results" element={<ResultsHomePage />} />
						</Route>
					</Routes>
				</Box>
			</ThemeProvider>
		</>
	);
}

export default App;
