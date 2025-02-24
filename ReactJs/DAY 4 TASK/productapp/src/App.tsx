import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Products from "./Pages/Products";
import AddProduct from "./Pages/AddProduct";
import ViewProduct from "./Pages/ViewProduct";
import EditProduct from "./Pages/EditProduct";
import NotFound from "./components/404NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,  // Use Layout for Proper Positioning
    children: [
      { path: "/products", element: <Products /> },
      { path: "/add-product", element: <AddProduct /> },
      { path: "/view-product/:id", element: <ViewProduct /> },
      { path: "/edit-product/:id", element: <EditProduct /> },
      { path: "*", element: <NotFound /> },
      
    ],
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
