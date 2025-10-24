import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DefaultLoader from '../components/common/DefaultLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <DefaultLoader />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
