import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../state/AuthContext.jsx';

// Wraps every page under /admin/*. While auth state is still loading we
// render a tiny spinner so logged-in admins don't see a flash of the
// login page; once resolved we either render the children or redirect.

export default function ProtectedAdminRoute({ children }) {
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-leaf-600">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
