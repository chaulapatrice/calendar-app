import _axios from "axios";
import useAuthStore from "../store/auth.ts";

const axios = _axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axios.interceptors.request.use(function (config) {
  if (config.url?.includes("login")) {
    return config;
  }

  const { token } = useAuthStore.getState();

  if (!token) {
    throw new Error("User not authenticated");
  }

  config.headers["Authorization"] = `Token ${token}`;

  return config;
});

export default axios;