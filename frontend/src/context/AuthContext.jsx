// context/AuthContext.js
import { createContext, useState } from "react";

// Step 1: Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	// Simulate logged-in user

	// const [user, setUser] = useState({ email: "admin@cmrit.ac.in", name: "Super Admin" });
	// const [role, setRole] = useState("admin");
	// const [superAdmin, setSuperAdmin] = useState(true); // Simulate admin role (uncomment to check)
	const [superAdmin, setSuperAdmin] = useState(false);
	const [user, setUser] = useState({ email: "hod.cse@cmrit.ac.in", name: "Dr.Kesavamoorthy R.", department: "CSE" });
	const [role, setRole] = useState("admin"); // Simulate admin role (uncomment to check)
	// const [user, setUser] = useState({ email: "hod.aiml@cmrit.ac.in", name: "Dr.Shyam P Joy", department: "AIML" });
	// const [role, setRole] = useState("admin"); // Simulate admin role (uncomment to check)

	// const [user, setUser] = useState({ email: "jane.smith@example.com", name: "Jane Smith", department: "CSE" });
	// const [role, setRole] = useState("teacher"); // Simulate teacher role
	// const [user, setUser] = useState({ email: "julie.mars@example.com", name: "Julie Mars", department: "CSE" });
	// const [role, setRole] = useState("teacher"); // Simulate teacher role
	// const [user, setUser] = useState({
	// 	email: "marcus.sterling@example.com",
	// 	name: "Marcus Sterling",
	// 	department: "AIML",
	// });
	// const [role, setRole] = useState("teacher"); // Simulate teacher role

	// const [user, setUser] = useState({ email: "john.doe@example.com" });
	// const [role, setRole] = useState("student"); // Simulate student role
	// const [user, setUser] = useState({ email: "bob.brown@example.com" });
	// const [role, setRole] = useState("student"); // Simulate student role
	// const [user, setUser] = useState({ email: "david.lee@example.com" });
	// const [role, setRole] = useState("student"); // Simulate student role
	// const [user, setUser] = useState({ email: "isro22cs@cmrit.ac.in" });
	// const [role, setRole] = useState("student"); // Simulate student role
	// const [user, setUser] = useState({ email: "nasa22cs@cmrit.ac.in" });
	// const [role, setRole] = useState("student"); // Simulate student role
	// const [superAdmin, setSuperAdmin] = useState(false);

	const login = (userData) => {
		setUser(userData);
		setRole(userData.role);
	};

	const logout = () => {
		setUser(null);
		setRole(null);
	};

	return <AuthContext.Provider value={{ user, role, superAdmin, login, logout }}>{children}</AuthContext.Provider>;
};

// import { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
// 	const [user, setUser] = useState(null);
// 	const [role, setRole] = useState(null);
// 	const [registered, setRegistered] = useState(null);
// 	const [superAdmin, setSuperAdmin] = useState(false);
// 	const [loading, setLoading] = useState(true);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const load = async () => {
// 			const token = sessionStorage.getItem("token");
// 			if (token) {
// 				const decodedToken = JSON.parse(atob(token.split(".")[1]));
// 				setUser({
// 					email: decodedToken.email,
// 					name: decodedToken.name,
// 					department: decodedToken.department,
// 				});
// 				setRole(decodedToken.role);
// 				setRegistered(decodedToken.registered);
// 				setSuperAdmin(decodedToken.superAdmin === true);
// 			}
// 			setLoading(false);
// 		};
// 		load();
// 	}, []);

// 	const login = (token) => {
// 		sessionStorage.setItem("token", token);
// 		const decodedToken = JSON.parse(atob(token.split(".")[1]));

// 		setUser({
// 			email: decodedToken.email,
// 			name: decodedToken.name,
// 			department: decodedToken.department,
// 		});
// 		setRole(decodedToken.role);
// 		setRegistered(decodedToken.registered);
// 		setSuperAdmin(decodedToken.superAdmin === true);

// 		setTimeout(() => {
// 			if (!decodedToken.registered) {
// 				navigate("/register");
// 			} else if (decodedToken.role === "admin") {
// 				navigate("/admin/dashboard");
// 			} else if (decodedToken.role === "evaluator") {
// 				navigate("/evaluator/dashboard");
// 			} else {
// 				navigate("/student");
// 			}
// 		}, 100);
// 	};

// 	const logout = () => {
// 		sessionStorage.removeItem("token");
// 		setUser(null);
// 		setRole(null);
// 		setRegistered(null);
// 		setSuperAdmin(false);
// 		navigate("/");
// 	};

// 	if (loading) return <div>Loading...</div>;

// 	return (
// 		<AuthContext.Provider value={{ user, role, registered, superAdmin, login, logout }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };
