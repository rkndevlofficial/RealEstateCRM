import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://realestatecrm-ew4v.onrender.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      token !== "undefined" &&
      token !== "null"
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isLoginRequest =
      requestUrl.includes("/auth/login");

    const isForgotPasswordRequest =
      requestUrl.includes("/auth/forgot-password");

    const isResetPasswordRequest =
      requestUrl.includes("/auth/reset-password");

    // Password recovery requests should NOT logout admin
    if (
      status === 401 &&
      !isLoginRequest &&
      !isForgotPasswordRequest &&
      !isResetPasswordRequest
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminUser");

      localStorage.setItem(
        "adminSessionMessage",
        "Your session has expired. Please login again."
      );

      if (
        window.location.pathname.startsWith("/admin")
      ) {
        window.location.href = "/admin";
      }
    }

    return Promise.reject(error);
  }
);

export default API;