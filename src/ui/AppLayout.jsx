import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

export default function AppLayout() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <SideNav />

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
