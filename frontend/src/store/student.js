import { create } from "zustand";

export const useStudentStore = create((set) => ({
	students: [],
	setStudents: (students) => set({ students }),

	createStudent: async (newStudent) => {
		const res = await fetch("/api/students", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newStudent),
		});

		const data = await res.json();
		set((state) => ({ students: [...state.students, data.data] }));
		return { success: true, message: "Student created successfully" };
	},

	findStudent: async (emailId) => {
		try {
			const emailData = { email: emailId };
			const res = await fetch("/api/students/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailData),
			});

			const data = await res.json();
			return { success: true, data: data.data, message: "Student found successfully" };
		} catch (error) {
			return { success: true, message: "Student Not Found" };
		}
	},

	fetchStudents: async () => {
		const res = await fetch("/api/students");
		const data = await res.json();

		set({ students: data.data });
	},

	fetchStudentById: async (studentId) => {
		const res = await fetch(`/api/students/${studentId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchParticipationRecord: async (studentId) => {
		try {
			const res = await fetch(`/api/students/participation-record/${studentId}`);
			const data = await res.json();

			if (!data.success) throw new Error(data.message);
			return data.data;
		} catch (error) {
			console.error("Error fetching teacher records:", error);
			return [];
		}
	},

	findIfIsRegistered: async (studentId, eventId) => {
		try {
			const res = await fetch(`/api/students/is-registered/${studentId}/${eventId}`);
			const data = await res.json();
			console.log(data);

			if (!data.success) throw new Error(data.message);
			return data;
		} catch (error) {
			console.error("Error fetching teacher records:", error);
			return;
		}
	},

	updateStudent: async (studentId, updatedStudent) => {
		const res = await fetch(`/api/students/${studentId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedStudent),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ students: state.students.map((student) => (student._id === studentId ? data.data : student)) }));
		return { success: "true", message: data.message };
	},
}));
