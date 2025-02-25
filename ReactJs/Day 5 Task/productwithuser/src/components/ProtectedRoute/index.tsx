import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtVerify } from "jose";
import { Spin } from "antd";


const SECRET_KEY = new TextEncoder().encode(
  "a9d0baf35b6eca8c6664af58722afa050f623bf11470e0dbba05d6786b194d4da5e56d68cee5bfd8f73736bce11be2938a5d8ea070824a362dcf51f04fbc4a6ebeeb6c0eb26317ef9d7e1b1bf8d4289c2d87666e8150bbb040d552c7fd3f791168855584b99c4f492ec2dbf19a0ecdd69afc34e0e5d38be0174c67c14c813f55"
);


const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log(payload);
    return payload; 
  } catch (error) {
    return null;
  }
};

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const userData = await verifyToken(token);
      setIsAuthenticated(!!userData); 
    };

    checkAuth();
  }, []);

  
  if (isAuthenticated === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Authenticating..." />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
