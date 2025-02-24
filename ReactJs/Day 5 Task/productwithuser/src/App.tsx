import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ViewProduct from "./pages/ViewProduct";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/User";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <ProtectedRoute />, // ✅ Only authenticated users can access this
    children: [
      {
        path: "/",
        element: <AppLayout />, // ✅ Navbar + Sidebar Wrapper
        children: [
          { path: "", element: <Products /> },
          { path: "products", element: <Products /> },
          { path: "add-product", element: <AddProduct /> },
          { path: "view-product/:id", element: <ViewProduct /> },
          { path: "edit-product/:id", element: <EditProduct /> },
          { path: "users", element: <Users /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> }, // ✅ 404 Page
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
