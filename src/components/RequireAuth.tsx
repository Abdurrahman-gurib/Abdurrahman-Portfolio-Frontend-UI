import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { COPY } from '../content/copy';
import { LoadingLine } from './Skeleton';

/**
 * Route guard for /backoffice. Waits for the first /api/auth/me check, then either renders the child routes
 * or redirects to /backoffice/login with the attempted path in location.state.from.
 */
export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container">
        <LoadingLine label={COPY.backoffice.checkingSession} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/backoffice/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <Outlet />;
}
