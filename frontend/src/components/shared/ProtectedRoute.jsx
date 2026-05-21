import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
	return (
  	<div className="flex items-center justify-center min-h-screen">
    	<p className="text-textMuted">Cargando...</p>
  	</div>
	);
  }

  if (!user) {
	return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
	return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

