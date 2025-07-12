// components/tables/StudentTable.jsx
import { useContext } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Container,
	Typography,
} from "@mui/material";
import { getStudents } from "../../hooks/useStudents.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import BackButton from "../BackButton.jsx";

const StudentTable = () => {
	const { students } = getStudents();
	const { user, role, logout } = useContext(AuthContext);

	return (
		<Container>
			<BackButton />
			<Typography variant="h4">Student List</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Student Name</TableCell>
							<TableCell>Event</TableCell>
							<TableCell>USN</TableCell>
							<TableCell>Participation Record</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{students.map((student) => (
							<TableRow key={student._id}>
								<TableCell>{student.name}</TableCell>
								<TableCell>{student.email}</TableCell>
								<TableCell>{student.usn}</TableCell>
								<TableCell>
									{role === "admin" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/admin/student-details/${student._id}`}
										>
											View
										</Button>
									)}
									{role === "teacher" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/teacher/student-details/${student._id}`}
										>
											View
										</Button>
									)}
									{role === "student" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/student/student-details/${student._id}`}
										>
											View
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default StudentTable;
