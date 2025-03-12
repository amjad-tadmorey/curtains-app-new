import { NavLink } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaCog, FaUsers } from "react-icons/fa";
import Logout from "../features/auth/Logout";

const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: FaHome },
    { name: "Orders", path: "/orders", icon: FaList },
    { name: "Products", path: "/products", icon: FaShoppingCart },
    { name: "Settings", path: "/settings", icon: FaCog },
    { name: "Accounts", path: "/accounts", icon: FaUsers },
];

export default function SideNav() {
    return (
        <aside className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">
            <img src="/Logo.png" alt="" />
            <h1 className="text-xl font-bold mb-6 mt-3">Kabbani Curtains App</h1>
            <nav className="flex flex-col space-y-2 flex-1">
                {navItems.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                        }
                    >
                        <Icon className="w-5 h-5" />
                        {name}
                    </NavLink>
                ))}
            </nav>

            <Logout />
        </aside>
    );
}