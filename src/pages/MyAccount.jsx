import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import supabase from "../services/supabase";

export default function MyAccount() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function fetchUser() {
            const { data: userData, error } = await supabase.auth.getUser();
            if (userData) {
                setUser(userData.user);
                setName(userData.user.user_metadata?.name || "");
            }
            if (error) console.error(error);
        }
        fetchUser();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const filePath = `avatars/${user.id}/${file.name}`;
        setLoading(true);
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { upsert: true });

        if (error) {
            console.error(error);
        } else {
            const { data: publicURL } = supabase.storage.from("avatars").getPublicUrl(filePath);
            await supabase.auth.updateUser({ data: { avatar: publicURL.publicUrl } });
            setUser({ ...user, user_metadata: { ...user.user_metadata, avatar: publicURL.publicUrl } });
            setSuccessMessage("Profile image updated successfully!");
        }
        setLoading(false);
    };

    const handleNameUpdate = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ data: { name } });
        if (error) console.error(error);
        else setSuccessMessage("Name updated successfully!");
        setLoading(false);
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) console.error(error);
        else setSuccessMessage("Password updated successfully!");
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold">My Account</h2>
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <div className="relative w-24 h-24 mx-auto">
                <img
                    src={user?.user_metadata?.avatar || "/blank-user.webp"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full cursor-pointer">
                    <FaRegEdit className="w-5 h-5" />
                    <input type="file" onChange={handleImageUpload} className="hidden" disabled={loading} />
                </label>
            </div>
            <div>
                <label className="block">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                />
                <button onClick={handleNameUpdate} className="mt-2 bg-blue-500 text-white p-2 rounded" disabled={loading}>
                    Update Name
                </button>
            </div>
            <div>
                <label className="block">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full"
                />
                <button onClick={handlePasswordChange} className="mt-2 bg-red-500 text-white p-2 rounded" disabled={loading}>
                    Change Password
                </button>
            </div>
        </div>
    );
}