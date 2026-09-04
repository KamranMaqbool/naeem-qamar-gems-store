import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../lib/api';

export default function ProtectedRoute() {
  const location = useLocation();
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" replace state={{ from: location }} />;
}
