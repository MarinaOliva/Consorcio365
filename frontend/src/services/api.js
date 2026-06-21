import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Adjunta el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Solo desloguear automáticamente en endpoints NO relacionados con auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
	const url = error.config?.url || "";

	// Endpoints donde un 401 NO debe desloguear automáticamente
	const isAuthEndpoint =
  	url.includes("/auth/login") ||
  	url.includes("/auth/cambiar-password") ||
  	url.includes("/auth/reset-password") ||
  	url.includes("/auth/recuperar");

	const hadToken = !!localStorage.getItem("token");

	if (error.response?.status === 401 && !isAuthEndpoint && hadToken) {
  	localStorage.removeItem("token");
  	localStorage.removeItem("user");
  	window.location.href = "/login";
	}

	return Promise.reject(error);
  }
);

export default api;

