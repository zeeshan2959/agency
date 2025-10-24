import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const finalRoutes = routes.map((route) => {
    const Layout = route.layout === 'blank' ? BlankLayout : DefaultLayout;

    let element = <Layout key={route.layout}>{route.element}</Layout>;

    if (route.auth === 'private') {
        element = <ProtectedRoute>{element}</ProtectedRoute>;
    } else if (route.auth === 'public') {
        element = <PublicRoute>{element}</PublicRoute>;
    }

    return {
        ...route,
        element,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
