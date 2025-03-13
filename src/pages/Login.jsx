import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../services/supabase";

export default function Login() {
    const { login, logout, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [branch, setBranch] = useState("");
    const [error, setError] = useState("");

    // if (user) {
    //     navigate("/");
    //     return null;
    // }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {

            const { user, error: loginError } = await login(email, password);
            if (loginError) throw loginError;


            const { data, error: fetchError } = await supabase.auth.getUser();
            if (fetchError) throw fetchError;

            const userMetadata = data?.user?.user_metadata;
            console.log("Fetched User Metadata:", userMetadata);


            if (!userMetadata || userMetadata.branch !== branch) {
                setError("Login failed. Selected branch does not match user branch.");
                await logout();
                return;
            }

            navigate("/");
        } catch (err) {
            console.error(err.message);
            setError("Login failed. Check your credentials.");
        }
    };
    console.log(error);

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700">Branch</label>
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        required
                    >
                        <option value="">Select a branch</option>
                        <option value="all">All</option>
                        <option value="cairo">Cairo</option>
                        <option value="alexandria">Alexandria</option>
                        <option value="october">October</option>
                        <option value="delta">Delta</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
