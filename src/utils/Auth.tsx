import { Navigate } from "react-router-dom";

const Auth = ({ children }: any) => {

    const token = localStorage.getItem('token');
    if(token) {
        return children;
    }
    return (
        <Navigate to={'/login'} />
    )

  
 
   
  

  
};

export default Auth;
