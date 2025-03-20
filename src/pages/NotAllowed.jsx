import { useNavigate } from "react-router-dom";

function NotAllowed() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-600">403</h1>
            <h2 className="text-2xl font-semibold mt-4">Access Denied</h2>
            <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
            <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition"
            >
                Go Home
            </button>
        </div>
    );
}

export default NotAllowed;
