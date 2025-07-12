import { create } from "zustand";

export const useScoreStore = create((set) => ({
	score: [],
	createScore: async (newScore) => {
		const res = await fetch("/api/scores", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newScore),
		});

		const data = await res.json();
		set((state) => ({ scores: [...state.scores, data.data] }));
		return { success: true, message: "Score created successfully" };
	},

	fetchScoresByEvent: async (eventId) => {
		const res = await fetch(`/api/scores/${eventId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchAllScoresByEvent: async (eventId) => {
		const res = await fetch(`/api/scores/all-scores/${eventId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchParticipantScore: async (eventId, participantId) => {
		const res = await fetch(`/api/scores/participant-score/${eventId}/${participantId}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},
}));
