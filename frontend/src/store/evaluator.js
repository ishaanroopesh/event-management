import { create } from "zustand";

export const useEvaluatorStore = create((set) => ({
	evaluators: [],
	setEvaluators: (evaluators) => set({ evaluators }),

	createEvaluator: async (newEvaluator) => {
		const res = await fetch("/api/evaluators", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newEvaluator),
		});

		const data = await res.json();
		set((state) => ({ evaluators: [...state.evaluators, data.data] }));
		return { success: true, message: "Evaluator created successfully" };
	},

	fetchEvaluators: async () => {
		const res = await fetch("/api/evaluators");
		const data = await res.json();
		console.log(data);

		set({ evaluators: data.data });
	},

	fetchEvaluatorById: async (rid) => {
		const res = await fetch(`/api/evaluators/${rid}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	fetchEvaluatorsByEvent: async (eventId) => {
		const res = await fetch(`/api/evaluators/${eventId}`);
		const data = await res.json();

		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	// router.get("/:evaluatorId/:eventId", getAssignedStudents);
	fetchAssignedStudents: async (evaluatorId) => {
		const res = await fetch(`/api/evaluators/assigned-students/${evaluatorId}`);
		const data = await res.json();

		console.log(data.data);
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	updateEvaluator: async (rid, updatedEvaluator) => {
		const res = await fetch(`/api/evaluators/${rid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedEvaluator),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			evaluators: state.evaluators.map((evaluator) => (evaluator._id === rid ? data.data : evaluator)),
		}));
		return { success: "true", message: data.message };
	},

	// addParticipantsToEvaluator: async (id, participantList) => {
	// 	const res = await fetch(`/api/evaluators/add-participants/${id}`, {
	// 		method: "PUT",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({participantIds:participantList}),
	// 	});
	// 	const data = await res.json();
	// 	if (!data.success) {
	// 		return { success: false, message: data.message };
	// 	}

	// 	set((state) => ({
	// 		evaluators: state.evaluators.map((evaluator) => (evaluator._id === rid ? data.data : evaluator)),
	// 	}));
	// 	return { success: "true", message: data.message };
	// },

	addParticipantsToEvaluator: async (id, participantList) => {
		const res = await fetch(`/api/evaluators/add-participants/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ participantIds: participantList }), // Ensure correct format
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({
			evaluators: state.evaluators.map((evaluator) => (evaluator._id === id ? data.data : evaluator)),
		}));
		return { success: true, message: data.message };
	},
}));
