// store/auth.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
	user: null,
	role: null, // 'admin', 'evaluator', 'student'
	setUser: (user) => set({ user }),
	setRole: (role) => set({ role }),
	logout: () => set({ user: null, role: null }),
}));
