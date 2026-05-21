import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Adjunta el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
	const isLoginRequest = error.config?.url?.includes("/auth/login");
	const hadToken = !!localStorage.getItem("token");

	// Solo desloguea si NO es un intento de login y el user ya estaba logueado
	if (error.response?.status === 401 && !isLoginRequest && hadToken) {
  	localStorage.removeItem("token");
  	localStorage.removeItem("user");
  	window.location.href = "/login";
	}

	return Promise.reject(error);
  }
);

export default api;


