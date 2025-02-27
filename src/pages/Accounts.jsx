import { useState } from "react";

export default function Accounts() {
    const [role, setRole] = useState("user");

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Add Account</h1>

            <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input type="text" className="w-full p-2 border rounded-lg" placeholder="Enter name" />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input type="email" className="w-full p-2 border rounded-lg" placeholder="Enter email" />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select className="w-full p-2 border rounded-lg" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition">
                Add Account
            </button>
        </div>
    );
}