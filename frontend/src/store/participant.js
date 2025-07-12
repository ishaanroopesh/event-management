import { create } from "zustand";

export const useParticipantStore = create((set) => ({
	participants: [],
	setParticipants: (participants) => set({ participants }),

	createParticipant: async (newParticipant) => {
		console.log(newParticipant);
		const res = await fetch("/api/participants", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newParticipant),
		});

		const data = await res.json();
		set((state) => ({ participants: [...state.participants, data.data] }));
		return { success: true, message: "Participant created successfully" };
	},

	fetchParticipants: async () => {
		const res = await fetch("/api/participants");
		const data = await res.json();
		console.log(data);

		set({ participants: data.data });
	},

	fetchParticipantById: async (rid) => {
		const res = await fetch(`/api/participants/${rid}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchParticipantsByEvent: async (eventId) => {
		const res = await fetch(`/api/participants/${eventId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}
		console.log(data.data);
		return data.data;
	},

	updateParticipant: async (rid, updatedParticipant) => {
		const res = await fetch(`/api/participants/${rid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedParticipant),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			participants: state.participants.map((participant) => (participant._id === rid ? data.data : participant)),
		}));
		return { success: "true", message: data.message };
	},
}));
