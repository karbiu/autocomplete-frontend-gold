import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  console.log( "Executing ProtectedRoute" );
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log( "user: ", user );
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

