// import { useEffect, useState } from 'react';
// import { Alert, Snackbar } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const instance = axios.create({
//   baseURL: 'http://192.168.87.1:8080/',
// });


// const AxiosInterceptor = ({ children }: any) => {

//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState('');

//   const handleClose = (reason: any) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpen(false);
//   };

//   useEffect(() => {
//     instance.interceptors.request.use( (config:any) => {
//       debugger
//       const token =   localStorage.getItem('token');
     

      
    
      
    
    
//       return {
//         ...config,
//         headers: {
//           ...(token !== null && { Authorization: `${token}` }),
//           ...config.headers,
//         },
//       };
//     });
    
//     const resInterceptor = (response: any) => {

     
      
//       return response;
//     };
 

//     const errInterceptor = (error: any) => {
   

//       setOpen(true);
    
//       setError(
//         error?.response?.data?.message
//           ? error?.response?.data?.message
//           : 'مشکلی به وجود آمده است'
//       );
   
   
//       // if (error.response && [301, 302].includes(error.response.status)) {
     
//       //   const redirectUrl = error.response.headers.location;
//       //   return instance.get(redirectUrl);
//       // }
//       if (error.response.status === 401) {
 
//         setError("نشست شما منقضی شده است")
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
       
//         navigate('/login');
//       }
//       // if (error.response.status === 302) {
//       //       window.location.href = "https://panel-ds-dev.kalaresanehasti.com/bff/login?returnUrl=/home"
//       //   // localStorage.removeItem('token');
//       //   // navigate('/login');
//       // }

//       return Promise.reject(error);
//     };
//     const interceptor = instance.interceptors.response.use(
//       resInterceptor,
//       errInterceptor
//     );


//     return () => instance.interceptors.response.eject(interceptor);

//   }, [navigate]);

//   return (
//     <>
//       {children}
//       <>
//         <Snackbar
//           color="danger"
//           open={open}
//           onClose={handleClose}
//           autoHideDuration={3000}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//           sx={{
//             '& .MuiAlert-message': {
//               paddingRight: '.5rem',
//             },
//           }}
//         >
//           <Alert severity="error">{error}</Alert>
//         </Snackbar>
//       </>
//     </>
//   );
// };

// export default instance;
// export { AxiosInterceptor };
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React from "react";
console.log(window.location.pathname);
const instance = axios.create({
  baseURL: "http://45.139.11.225:5533/api/",
});

const AxiosInterceptor = ({ children }: any) => {

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

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
    //const url = response.config.url;

    //setLocalStorageToken(token);
    return response;
  },
  (error) => {
    if(!error.response) {
   
      setOpen(true);
      setError("اینترنت شما قظع شده است")
      // localStorage.setItem("errorMessage","اینترنت شما قظع شده است")
    }else {
      if (error.response.status === 401) {
        setOpen(true);
        setError("نشست شما منقضی شده است")
        //(`unauthorized :)`);
        localStorage.clear();
        //removeLocalStorageToken
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
          color="danger"
          open={open}
          onClose={handleClose}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </>
    </>
  );
};

export default instance;
export { AxiosInterceptor };
// import axios from "axios";


// const instance = axios.create({
//   baseURL: "http://192.168.87.1:8080/",
// });

// instance.interceptors.request.use(
//   (config:any) => {
//     const token =  localStorage.getItem("token");
//     return {
//       ...config,
//       headers: {
//         ...(token !== null && { Authorization: `Bearer ${token}` }),
//         ...config.headers,
//       },
//     };
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.response.use(

//   (response) => {
//     //const url = response.config.url;

//     //setLocalStorageToken(token);
//     return response;
//   },
//   (error) => {
//     if(!error.status) {
//       // localStorage.setItem("errorMessage","اینترنت شما قظع شده است")
//     }
//     if (error.response.status === 401) {
//       //(`unauthorized :)`);
//       localStorage.clear();
//       //removeLocalStorageToken
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default instance;

