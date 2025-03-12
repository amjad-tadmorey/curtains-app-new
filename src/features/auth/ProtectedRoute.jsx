import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Login from "../../pages/Login";
import Spinner from "../../ui/Spinner";

export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    if (isLoading) return <Spinner />
    console.log(user?.user_metadata);

    if (!user) {
        return <Login />;
    }

    return children;
}
