import axios from "axios";

// Token management
const getToken = () => localStorage.getItem("authToken");
const setToken = (token) => localStorage.setItem("authToken", token);
const removeToken = () => localStorage.removeItem("authToken");

// CSRF token retrieval from cookies
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
};

// Axios instance configuration
const api = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? "http://localhost:8000/client" : "http://localhost:8000/client",
    timeout: 0,
    withCredentials: true, // Important for cookies
});

// Axios request interceptor
api.interceptors.request.use(
  (config) => {
      const token = getToken();
      if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
      }
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
          config.headers["X-CSRFToken"] = csrfToken;
          console.log("Adding CSRF token to headers:", csrfToken); // Debugging
      }
      return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 ) {
            if(originalRequest.url === "/client/user-profile/"){
                redirectToLogin();
                return Promise.reject(error);
            }
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    console.error("No refresh token available.");
                    redirectToLogin();
                    return Promise.reject(error);
                }
                try {
                    const tokenResponse = await api.post('/token/refresh', { refresh: refreshToken });
                    const { access, refresh } = tokenResponse.data;
                    if (access) {
                        setToken(access);
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;
                        if (refresh) {
                            localStorage.setItem('refreshToken', refresh);
                        }
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Failed to refresh token:", refreshError);
                    redirectToLogin();
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);
// Helper function for redirecting to the login page
function redirectToLogin() {
    removeToken();
    localStorage.removeItem('refreshToken');
}

// API utility functions
export const getRequest = (url, config = {}) => api.get(url, config).then(res => res.data);
export const postRequest = (url, data, config = {}) => api.post(url, data, config).then(res => res.data);
export const putRequest = (url, data, config = {}) => api.put(url, data, config).then(res => res.data);
export const deleteRequest = (url, config = {}) => api.delete(url, config).then(res => res.data);
export const patchRequest = (url, data, config = {}) => api.patch(url, data, config).then(res => res.data);
export const headRequest = (url, config = {}) => api.head(url, config).then(res => res.headers);

export { getToken, setToken, removeToken };
export default api;
