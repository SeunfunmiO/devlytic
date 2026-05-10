import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { isAuthenticated, role, isInitializing } = useSelector((state) => state.auth);

    // Wait for useAuthInit to finish before making any decision
    if (isInitializing) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
                <Code2 size={32} className="text-indigo-500 animate-pulse" />
                <p className="text-gray-400 text-sm">Loading Devlytic...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;