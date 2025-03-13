import axios from "axios";

const getToken = () => localStorage.getItem("authToken");
const setToken = (token) => localStorage.setItem("authToken", token);
const removeToken = () => localStorage.removeItem("authToken");


const api = axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? "http://localhost:8000/client"
        : "http://localhost:8000/client",
    timeout: 0,
  });
  
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getRequest = (url, config = {}) =>
  api.get(url, config).then((res) => res.data);
export const postRequest = (url, data, config = {}) =>
  api.post(url, data, config).then((res) => res.data);
export const putRequest = (url, data, config = {}) =>
  api.put(url, data, config).then((res) => res.data);
export const deleteRequest = (url, config = {}) =>
  api.delete(url, config).then((res) => res.data);
export const patchRequest = (url, data, config = {}) =>
  api.patch(url, data, config).then((res) => res.data);
export const headRequest = (url, config = {}) =>
  api.head(url, config).then((res) => res.headers);

export { getToken, setToken, removeToken };
export default api;