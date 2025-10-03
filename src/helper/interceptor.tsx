import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
console.log(window.location.pathname);
const instance = axios.create({
  baseURL: "http://45.139.11.225:5533/api/admin/",
});
const AxiosInterceptor = ({ children }: any) => {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSuccess,setIsSuccess] = useState<boolean>(false);
  const handleClose = (event: any, reason: any) => {
    console.log(event)
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  instance.interceptors.request.use(
  (config:any) => {
    
    const token =  localStorage.getItem("token");
    return {
      ...config,
      headers: {
        ...(token !== null && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    if(response.data.isSuccess) {
      setOpen(true);
      setIsSuccess(true);
      setError(response.data.statusMessage);

    }else {
      setIsSuccess(false);
      setError(response.data.statusMessage);
    }
    return response;
  },
  (error) => {
    setIsSuccess(false);
    if(!error.response) {
      setOpen(true);
      setError("اینترنت شما قظع شده است")

    }else {
      if (error.response.status === 401) {
        setOpen(true);
        setError("نشست شما منقضی شده است")
        localStorage.clear();
        window.location.href = "/login";
      }else {
      setOpen(true);
      setError(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : 'مشکلی به وجود آمده است'
      );
      }
    }
    return Promise.reject(error);
  }
);
  return (
    <>
      {children}
      <>
        <Snackbar
          open={open}
          onClose={handleClose}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={isSuccess ? "success" : "error"}>{error}</Alert>
        </Snackbar>
      </>
    </>
  );
};
export default instance;
export { AxiosInterceptor };


