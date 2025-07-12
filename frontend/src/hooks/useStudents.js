import { useEffect } from "react";
import { useStudentStore } from "../store/student.js";

export const getStudents = () => {
	const { fetchStudents, students } = useStudentStore();

	useEffect(() => {
		fetchStudents(); // Fetch students when the hook is used
	}, [fetchStudents]);

	return { students }; // Return the students for use in components
};
