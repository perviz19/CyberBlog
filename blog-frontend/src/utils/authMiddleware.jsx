import axios from "axios";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import { useEffect, useState } from "react";

export const PermissionCheck = ({ children }) => {
  const token = localStorage.getItem("Access-Token");
  const [isAuthorized, setIsAuthorized] = useState(null); 

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const decodedToken = jwtDecode(token);

          if (decodedToken.role === "admin" || decodedToken.role === "root") {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        }
      } catch {
        setIsAuthorized(false);
      }
    };

    if (token) {
      checkAuthorization();
    } else {
      setIsAuthorized(false);
    }
  }, [token]);
  
  if (isAuthorized === null) {
    return <p>Loading...</p>; 
  }

  return isAuthorized ? children : <Navigate to="/admin/login" replace />;
};
