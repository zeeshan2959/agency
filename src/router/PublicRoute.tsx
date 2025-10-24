import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DefaultLoader from '../components/common/DefaultLoader';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <DefaultLoader />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
