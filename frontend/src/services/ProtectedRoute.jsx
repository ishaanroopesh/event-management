import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
	const { user, role } = useContext(AuthContext);
	const navigate = useNavigate();
	if (!user) {
		// 🔄 Redirect to login if not logged in
		return navigate("/login");
	}

	if (requiredRole && role !== requiredRole) {
		// 🔄 Redirect if user doesn't have required role
		return navigate("/");
	}

	// ✅ Allow access if conditions are met
	return children;
};

export default ProtectedRoute;
