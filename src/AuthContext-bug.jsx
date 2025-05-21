import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/token", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
      setUser({ token: response.data.access_token });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (username, password) => {
    try {
      await axios.post("http://localhost:8000/signup", {
        username,
        password,
      });
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

