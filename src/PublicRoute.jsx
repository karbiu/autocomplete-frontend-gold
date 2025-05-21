import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useAuth();
  
  console.log( "Executing PublicRoute" );
  console.log( "user: ", user );
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

