import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import { PermissionProvider } from "./contexts/PermissionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/Users/UserList";
import EmployeeList from "./pages/Employees/EmployeeList";
import ProjectList from "./pages/Projects/ProjectList";
import RoleList from "./pages/Roles/RoleList";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Create routes
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredModule="users" requiredAction="view">
            <UserList />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees",
        element: (
          <ProtectedRoute requiredModule="employees" requiredAction="view">
            <EmployeeList />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects",
        element: (
          <ProtectedRoute requiredModule="projects" requiredAction="view">
            <ProjectList />
          </ProtectedRoute>
        ),
      },
      {
        path: "roles",
        element: (
          <ProtectedRoute requiredModule="roles" requiredAction="view">
            <RoleList />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AuthProvider>
      <PermissionProvider>
        <ConfigProvider theme={{ algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </PermissionProvider>
    </AuthProvider>
  );
}

export default App;
