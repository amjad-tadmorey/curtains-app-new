import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../ui/ProtectedRoute";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p>Welcome, {user?.email}!</p>
                <button onClick={logout} className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                    Logout
                </button>
            </div>
        </ProtectedRoute>
    );
}
