import { createContext, useEffect, useState } from "react";
import { loginRequest } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
	const stored = localStorage.getItem("user");
	if (stored) setUser(JSON.parse(stored));
	setLoading(false);
  }, []);

  const login = async (email, password) => {
	const { token, user } = await loginRequest(email, password);
	localStorage.setItem("token", token);
	localStorage.setItem("user", JSON.stringify(user));
	setUser(user);
	return user;
  };

  
  const updateUser = (updates) => {
	setUser((prev) => {
  	if (!prev) return prev;
  	const updated = { ...prev, ...updates };
  	localStorage.setItem("user", JSON.stringify(updated));
  	return updated;
	});
  };

  const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
	setUser(null);
  };

  return (
	<AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
  	{children}
	</AuthContext.Provider>
  );
}

