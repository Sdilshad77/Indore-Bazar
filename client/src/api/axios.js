import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("ib_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 400 || err?.response?.status === 401) {
      const msg = err?.response?.data?.message || "";
      if (msg.includes("Authorised") || msg.includes("No Token")) {
        localStorage.removeItem("ib_token");
        localStorage.removeItem("ib_user");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default API;