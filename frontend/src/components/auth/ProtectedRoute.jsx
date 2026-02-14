import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * Preserves the attempted URL in state for redirect after login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, saving the path they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
