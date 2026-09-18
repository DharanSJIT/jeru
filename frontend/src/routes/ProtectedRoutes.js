import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { verifyToken } from "./auth";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await verifyToken();
            setIsAuthenticated(authStatus);
        };
        checkAuth();
    }, []);

    // Show professional loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-brand"></div>
                    <p className="text-sm font-medium text-gray-500">Authenticating session...</p>
                </div>
            </div>
        );
    }

    // Pass the attempted URL via state so we can return them here after login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoutes;
