import { createContext, useEffect, useState } from "react";
import { loginRequest } from "../services/authService";

export const AuthContext = createContext(null);

// Helper: busca primero en localStorage, después en sessionStorage
function leerDeStorage(clave) {
  return localStorage.getItem(clave) || sessionStorage.getItem(clave);
}

// Helper: borra de ambos storages
function borrarDeStorage(clave) {
  localStorage.removeItem(clave);
  sessionStorage.removeItem(clave);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const stored = leerDeStorage("user");
	if (stored) setUser(JSON.parse(stored));
	setLoading(false);
  }, []);

  const login = async (email, password, recordarme = true) => {
	const { token, user } = await loginRequest(email, password);

	// Limpiamos ambos storages antes de guardar
	borrarDeStorage("token");
	borrarDeStorage("user");

	const storage = recordarme ? localStorage : sessionStorage;
	storage.setItem("token", token);
	storage.setItem("user", JSON.stringify(user));

	setUser(user);
	return user;
  };

  const updateUser = (updates) => {
	setUser((prev) => {
  	if (!prev) return prev;
  	const updated = { ...prev, ...updates };
  	// Guardamos en el storage donde ya estaba
  	if (localStorage.getItem("user")) {
    	localStorage.setItem("user", JSON.stringify(updated));
  	} else if (sessionStorage.getItem("user")) {
    	sessionStorage.setItem("user", JSON.stringify(updated));
  	}
  	return updated;
	});
  };

  const logout = () => {
	borrarDeStorage("token");
	borrarDeStorage("user");
	setUser(null);
  };

  return (
	<AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
  	{children}
	</AuthContext.Provider>
  );
}

