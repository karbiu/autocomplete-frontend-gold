import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Autocomplete from "./Autocomplete";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Autocomplete />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;

