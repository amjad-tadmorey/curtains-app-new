import { useAuth } from "../../context/AuthContext";
import { CiLogout } from "react-icons/ci";

export default function Logout() {
    const { logout, isLoading } = useAuth();

    return (
        <button
            onClick={logout}
            disabled={isLoading}
            className="bg-primary w-fit text-white py-1 px-1 lg:px-4 cursor-pointer rounded-lg hover:bg-primary-hover transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {isLoading ? "Logging out..." : <CiLogout size={25} />}
        </button>
    );
}
