import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import supabase from "../services/supabase";

export default function Accounts() {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const onSuggestPassword = () => {
        const newPassword = generatePassword();
        setValue("password", newPassword);
        setValue("confirmPassword", newPassword);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setMessage("❌ Passwords do not match!");
            return;
        }

        setLoading(true);
        setMessage("");

        let avatarUrl = null;

        if (data.avatar[0]) {
            const file = data.avatar[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `avatars/${data.email}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
                upsert: true,
            });

            if (uploadError) {
                setMessage("❌ Failed to upload image");
                setLoading(false);
                return;
            }

            const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(filePath);
            avatarUrl = publicUrl.publicUrl;
        }


        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: data.name,
                    role: data.role,
                    branch: data.branch,
                    avatar: avatarUrl,
                },
            },
        });

        if (error) {
            console.error("Error:", error.message);
            setMessage(`❌ ${error.message}`);
        } else {
            setMessage("✅ Account created successfully! Check your email to verify.");
            reset();
            setPreviewUrl(null);
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
                    <label className="block text-gray-700">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("avatar")}
                        onChange={handleImageChange}
                    />
                    {previewUrl && (
                        <div className="mt-3">
                            <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <div className="flex items-center gap-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter password"
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-2">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
                            onClick={onSuggestPassword}
                        >
                            Suggest
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <div className="flex items-center gap-2">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Confirm password"
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) => value === watch("password") || "Passwords do not match",
                            })}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="p-2">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select className="w-full p-2 border rounded-lg" {...register("role", { required: "Role is required" })}>
                        <option value="sales">Sales</option>
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
