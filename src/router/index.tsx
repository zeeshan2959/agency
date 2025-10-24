import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const finalRoutes = routes.map((route) => {
  const Layout = route.layout === 'blank' ? BlankLayout : DefaultLayout;

  let element = route.element;

  if (route.auth === 'private') {
    element = <ProtectedRoute>{element}</ProtectedRoute>;
  } else if (route.auth === 'public') {
    element = <PublicRoute>{element}</PublicRoute>;
  }

  return {
    ...route,
    element: <Layout key={route.layout}>{element}</Layout>,
  };
});
const router = createBrowserRouter(finalRoutes);

export default router;
