import { create } from "zustand";

export const useAdminStore = create((set) => ({
	admins: [],
	setAdmins: (admins) => set({ admins }),

	createAdmin: async (newAdmin) => {
		const res = await fetch("/api/admin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newAdmin),
		});

		const data = await res.json();
		set((state) => ({ admins: [...state.admins, data.data] }));
		return { success: true, message: "Admin created successfully" };
	},

	fetchAdmins: async () => {
		const res = await fetch("/api/admin");
		const data = await res.json();
		// console.log(data);

		set({ admins: data.data });
	},

	fetchAdminById: async (rid) => {
		const res = await fetch(`/api/admin/${rid}`);
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		return data.data;
	},

	findAdmin: async (emailId) => {
		try {
			const emailData = { email: emailId };
			const res = await fetch("/api/admin/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailData),
			});

			const data = await res.json();
			return { success: true, data: data.data, message: "Admin found successfully" };
		} catch (error) {
			return { success: true, message: "Admin Not Found" };
		}
	},

	updateAdmin: async (rid, updatedAdmin) => {
		const res = await fetch(`/api/admin/${rid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedAdmin),
		});
		const data = await res.json();
		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ admins: state.admins.map((admin) => (admin._id === rid ? data.data : admin)) }));
		return { success: "true", message: data.message };
	},
}));
