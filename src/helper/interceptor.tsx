import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const instance = axios.create({
  baseURL: "https://api.carmacheck.com/api/admin/",
  withCredentials: true
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

 

  const refreshAccessToken = async () => {
    try {
      console.log('🔄 Attempting to refresh token...');
      console.log('📍 Current cookies:', document.cookie);
      const res = await axios.get(
        "https://api.carmacheck.com/api/admin/Auth/refreshToken",
        {
          withCredentials: true,
          headers: {
            Authorization:` Bearer ${localStorage.getItem("accessToken")}`
          },
         
        }
      );

      const newAccessToken = res.data.resultObject.accessToken;
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
      if (error.response.status === 401) {
        
      

        try {
          const newToken = await refreshAccessToken();
     

          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return instance(originalRequest);
        } catch (err) {
         
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
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={isSuccess ? "success" : "error"}>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default instance;
export { AxiosInterceptor };
