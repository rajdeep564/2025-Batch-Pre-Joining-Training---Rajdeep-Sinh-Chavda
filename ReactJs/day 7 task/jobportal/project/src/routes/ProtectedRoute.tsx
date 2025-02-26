import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtVerify } from "jose";
import { Spin } from "antd";

const SECRET_KEY = new TextEncoder().encode("17be3477599fd243db976ea71d39490839051b0278462de79a21e07e7723eb0c95d68763e1884b2156626aa9604d612e7cfdc7202b3da107953d3adc8771534203a2fed405610d3c9602fb910ce62543293c57b4fcd9845b152bf3728adbe2be7952d509e9f10a281fa4cbf1b99017356a2a013ff869996ae769d6537f16f24e");

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
};

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
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

  return isAuthenticated ? (
    <React.Suspense
      fallback={
       
          <Spin size="large" tip="Loading..." />
        
      }
    >
      <Outlet />
    </React.Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
