import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                Go Home
            </Link>
        </div>
    );
}