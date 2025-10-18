import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const instance = axios.create({
  baseURL: "https://api.carmacheck.com/api/admin/",
  withCredentials: true, // ✅ include cookies in every request
});

const AxiosInterceptor = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleClose = (event: any, reason: any) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // --- Add access token to headers ---
  instance.interceptors.request.use(
    (config: any) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // --- Refresh token logic ---
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        "https://api.carmacheck.com/api/admin/Auth/refresh-token",
        {
          accessToken: localStorage.getItem("accessToken")
        },
        { withCredentials: true } // ✅ send the cookie automatically
      );

      const newAccessToken = res.data.accessToken;
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
      }

      return newAccessToken;
    } catch (err) {
      throw err;
    }
  };

  // --- Response interceptor ---
  instance.interceptors.response.use(
    (response) => {
      if (response.data?.isSuccess) {
        setIsSuccess(true);
        setError(response.data.statusMessage || "عملیات موفقیت‌آمیز بود");
      } else {
        setIsSuccess(false);
        setError(response.data?.statusMessage || "خطایی رخ داده است");
      }
      setOpen(true);
      return response;
    },
    async (error) => {
      setIsSuccess(false);

      if (!error.response) {
        setError("اتصال اینترنت شما قطع شده است");
        setOpen(true);
        return Promise.reject(error);
      }

      const originalRequest = error.config;

      // Handle expired access token
      if (error.response.status === 401 && !originalRequest._retry) {
        debugger
        if (isRefreshing) {
          debugger
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              debugger
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          isRefreshing = false;

          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return instance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
          localStorage.clear();
          setError("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
          setOpen(true);
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      // Other errors
      setError(
        error?.response?.data?.message ||
          "مشکلی به وجود آمده است، لطفاً دوباره تلاش کنید."
      );
      setOpen(true);
      return Promise.reject(error);
    }
  );

  return (
    <>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={isSuccess ? "success" : "error"}>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default instance;
export { AxiosInterceptor };
