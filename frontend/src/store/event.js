import { create } from "zustand";

export const useEventStore = create((set) => ({
	events: [],
	setEvents: (events) => set({ events }),

	createEvent: async (newEvent) => {
		const res = await fetch("/api/events", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newEvent),
		});

		const data = await res.json();
		set((state) => ({ events: [...state.events, data.data] }));
		return { success: true, message: "Event created successfully" };
	},

	createEventWithPoster: async (formData) => {
		const res = await fetch("/api/events/with-poster", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();
		if (!res.ok) {
			return { success: false, message: data.message || "Upload failed" };
		}

		set((state) => ({ events: [...state.events, data.data] }));
		return { success: true, message: "Event created with poster" };
	},

	fetchEvents: async () => {
		const res = await fetch("/api/events");
		const data = await res.json();
		// console.log(data);

		set({ events: data.data });
		return data.data;
	},

	fetchEventById: async (rid) => {
		const res = await fetch(`/api/events/${rid}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	getPoster: async (eventId) => {
		const res = await fetch(`/api/events/poster/${eventId}`);
		return res;
	},

	fetchUnassignedParticipants: async (eventId) => {
		const res = await fetch(`/api/events/unassigned-participants/${eventId}`);
		const data = await res.json();
		console.log(data);
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchAvailableStudents: async (eventId) => {
		const res = await fetch(`/api/events/available-students/${eventId}`);
		const data = await res.json();
		console.log(data);
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	updateEvent: async (rid, updatedEvent) => {
		const res = await fetch(`/api/events/${rid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedEvent),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ events: state.events.map((event) => (event._id === rid ? data.data : event)) }));
		return { success: "true", message: data.message };
	},

	uploadEventReport: async (eventId, formData) => {
		try {
			const res = await fetch(`/api/events/upload-report/${eventId}`, {
				method: "PUT",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) {
				return { success: false, message: data.message || "Report upload failed" };
			}

			set((state) => ({
				events: state.events.map((event) => (event._id === eventId ? { ...event, report: data.data.report } : event)),
			}));

			return { success: true, message: "Report uploaded successfully" };
		} catch (error) {
			console.error("Error in uploadEventReport:", error);
			return { success: false, message: "An unexpected client-side error occurred." };
		}
	},

	deleteEvent: async (rid) => {
		const res = await fetch(`/api/events/${rid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ events: state.events.filter((event) => event._id !== rid) }));
		return { success: true, message: data.message };
	},

	publishResults: async (rid) => {
		const res = await fetch(`/api/events/${rid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ resultsPublished: true }),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ events: state.events.map((event) => (event._id === rid ? data.data : event)) }));
		return { success: "true", message: data.message };
	},
}));
