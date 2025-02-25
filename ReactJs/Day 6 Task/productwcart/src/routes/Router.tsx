import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../pages/AppLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductView from "../pages/ProductView";
import ProductEdit from "../pages/ProductEdit";
import Cart from "../pages/CartPage";
import ProductAdd from "../pages/AddProduct";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Main layout wrapper
    children: [
      { path: "/", element: <Products /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <ProductView /> }, // ✅ Fixed path
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/products/edit/:id", element: <ProductEdit /> },
      { path: "/cart", element: <Cart /> },
      {path : "/addproduct" , element :<ProductAdd/>}
    ],
  },
]);

