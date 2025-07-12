import { Link } from "react-router-dom";
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
import { getTeachers } from "../../hooks/useTeachers.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import BackButton from "../BackButton.jsx";

const TeacherTable = () => {
	const { teachers } = getTeachers();
	const { user, role, logout } = useContext(AuthContext);

	return (
		<Container>
			<BackButton />
			<Typography variant="h4">Teacher List</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Teacher Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Evaluation Record</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teachers.map((teacher) => (
							<TableRow key={teacher._id}>
								<TableCell>{teacher.name}</TableCell>
								<TableCell>{teacher.email}</TableCell>
								<TableCell>
									{role === "admin" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/admin/teacher-details/${teacher._id}`}
										>
											View
										</Button>
									)}

									{role === "teacher" && (
										<Button
											variant="contained"
											color="primary"
											component={Link}
											to={`/teacher/teacher-details/${teacher._id}`}
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

export default TeacherTable;
