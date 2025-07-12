import { create } from "zustand";

export const useTeacherStore = create((set) => ({
	teachers: [],
	setTeachers: (teachers) => set({ teachers }),

	createTeacher: async (newTeacher) => {
		const res = await fetch("/api/teachers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTeacher),
		});

		const data = await res.json();
		set((state) => ({ teachers: [...state.teachers, data.data] }));
		return { success: true, message: "Teacher created successfully" };
	},

	fetchTeachers: async () => {
		const res = await fetch("/api/teachers");
		const data = await res.json();
		console.log(data);

		set({ teachers: data.data });
	},

	fetchTeacherById: async (teacherId) => {
		const res = await fetch(`/api/teachers/${teacherId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	findTeacher: async (emailId) => {
		const emailData = { email: emailId };
		const res = await fetch("/api/teachers/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(emailData),
		});

		const data = await res.json();
		console.log(data);
		return { success: true, data: data.data, message: "Teacher found successfully" };
	},

	fetchTeacherEvaluatorId: async (teacherId, eventId) => {
		const res = await fetch(`/api/teachers/${teacherId}/evaluator-id/${eventId}`);
		const data = await res.json();

		if (!data.success) {
			return { success: false, message: "Error" };
		}
		return { success: true, data: data.data, message: "Teacher's evaluator id found successfully" };
	},

	fetchAvailableTeachers: async (eventId) => {
		try {
			const res = await fetch(`/api/teachers/available-teachers/${eventId}`);
			const data = await res.json();
			if (!data.success) throw new Error(data.message);
			return data.data;
		} catch (error) {
			console.error("Error fetching available teachers:", error);
			return [];
		}
	},

	fetchEvaluationRecord: async (teacherId) => {
		try {
			const res = await fetch(`/api/teachers/evaluation-record/${teacherId}`);
			const data = await res.json();

			if (!data.success) throw new Error(data.message);
			return data.data;
		} catch (error) {
			console.error("Error fetching teacher records:", error);
			return [];
		}
	},

	fetchTeacherCreationRecord: async (teacherId) => {
		try {
			const res = await fetch(`/api/teachers/creation-record/${teacherId}`);
			const data = await res.json();

			if (!data.success) throw new Error(data.message);
			return data.data;
		} catch (error) {
			console.error("Error fetching teacher records:", error);
			return [];
		}
	},

	updateTeacher: async (rid, updatedTeacher) => {
		const res = await fetch(`/api/teachers/${rid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTeacher),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ teachers: state.teachers.map((teacher) => (teacher._id === rid ? data.data : teacher)) }));
		return { success: "true", message: data.message };
	},
}));
