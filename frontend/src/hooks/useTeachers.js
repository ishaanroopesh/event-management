// hooks/useTeachers.js

import { useEffect, useState } from "react";
import { useTeacherStore } from "../store/teacher.js";
import { set } from "mongoose";

export const getTeachers = () => {
	const { fetchTeachers, teachers } = useTeacherStore();

	useEffect(() => {
		fetchTeachers(); // Fetch teachers when the hook is used
	}, [fetchTeachers]);

	return { teachers }; // Return the teachers for use in components
};

export const getAvailableTeachers = (eventId) => {
	const { fetchAvailableTeachers } = useTeacherStore();
	const [availableTeachers, setAvailableTeachers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchAvailableTeachers(eventId); // Fetch available teachers
				setAvailableTeachers(data); // Store data
			} catch (err) {
				console.error("Error fetching available teachers:", err);
			} finally {
			}
		};

		if (eventId) fetchData(); // Only fetch if eventId exists
	}, [fetchAvailableTeachers, eventId]);

	return { availableTeachers };
};

export const getEvaluationRecord = (teacherId) => {
	const [evaluationRecord, setEvaluationRecord] = useState([]);
	const { fetchEvaluationRecord } = useTeacherStore();

	// useEffect(async () => {
	// 	try {
	// 		const evaluationRecordData = await fetchEvaluationRecord(teacherId);

	// 		setEvaluationRecord(evaluationRecordData);
	// 	} catch (error) {}
	// }, [teacherId]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchEvaluationRecord(teacherId); // Fetch available teachers
				setEvaluationRecord(data); // Store data
			} catch (err) {
				console.error("Error fetching available teachers:", err);
			} finally {
			}
		};

		if (eventId) fetchData(); // Only fetch if eventId exists
	}, [fetchEvaluationRecord, teacherId]);

	return { evaluationRecord };
};
