import { Link, NavLink } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaCog, FaUsers, FaUser } from "react-icons/fa";
import Logout from "../features/auth/Logout";
import { useAuth } from "../context/AuthContext";
import Spinner from './Spinner'
import { MdAdminPanelSettings } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from 'react-icons/fa'


const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: FaHome },
    { name: "Orders", path: "/orders", icon: FaList },
    { name: "Schedule", path: "/schedule", icon: FaCalendarAlt  },
    { name: "Products", path: "/products", icon: FaShoppingCart },
    { name: "Accounts", path: "/accounts", icon: FaUsers },
    { name: "Settings", path: "/settings", icon: FaCog },
];

export default function SideNav() {
    const { user, isLoading } = useAuth()
    if (isLoading) return <Spinner />
    return (
        <aside className="w-16 md:w-64 h-screen bg-gray-900 text-white p-4 flex flex-col transition-all">
            <Link to={'/'}><img src="/Logo.png" alt="" className="hidden md:block" /></Link>
            <h1 className="text-xl font-bold mb-1 mt-3 border-b border-gray-200 hidden md:block">Kabbani Curtains App</h1>
            <Link to={'/my-account'}><img src={user.user_metadata.avatar || "/blank-user.webp"} alt="" className="w-24 h-24 rounded-full my-4 hidden md:block" /></Link>
            <h1 className="text-xl font-bold mb-1 mt-1 flex items-center gap-4"> <FaUser className="w-5 h-5" /> <span className="hidden md:inline">{user.user_metadata.name}</span></h1>
            <h1 className="text-xl font-bold mb-1 mt-1 flex items-center gap-4"> <MdAdminPanelSettings className="w-5 h-5" /> <span className="hidden md:inline">{user.user_metadata.role}</span></h1>
            <h1 className="text-xl font-bold mb-6 mt-1 flex items-center gap-4"> <FaMapMarkerAlt className="w-5 h-5" /> <span className="hidden md:inline">{user.user_metadata.branch}</span></h1>
            <nav className="flex flex-col space-y-2 flex-1">
                {navItems.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 md:py-4 md:px-2 rounded-lg transition-all ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                        }
                    >
                        <Icon className="md:w-5 md:h-5 w-12 h-12" />
                        <span className="hidden md:inline">{name}</span>
                    </NavLink>
                ))}
            </nav>

            <Logout />
        </aside>
    );
}
