import { useState } from "react";
import { useForm } from "react-hook-form";
import supabase from "../services/supabase";



export default function Accounts() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: data.name,
                    role: data.role,
                    branch: data.branch,
                },
            },
        });

        if (error) {
            console.error("Error:", error.message);
            setMessage(`❌ ${error.message}`);
        } else {
            setMessage("✅ Account created successfully! Check your email to verify.");
            reset();
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>

            {message && <p className={`text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter name"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter password"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select className="w-full p-2 border rounded-lg" {...register("role", { required: "Role is required" })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-red-500">{errors.role.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Branch</label>
                    <select className="w-full p-2 border rounded-lg" {...register("branch", { required: "Branch is required" })}>
                        <option value="all">All</option>
                        <option value="cairo">Cairo</option>
                        <option value="alexandria">Alexandria</option>
                        <option value="october">October</option>
                        <option value="delta">Delta</option>
                    </select>
                    {errors.branch && <p className="text-red-500">{errors.branch.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}
