import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router";
import { CartProvider } from "./cart/CartContext"; 
import { ProductProvider } from "./product/ProductContext"; // ✅ Import ProductProvider
import "./App.css";

const App: React.FC = () => {
  return (
    <CartProvider> 
      <ProductProvider> 
        <RouterProvider router={router} />
      </ProductProvider>
    </CartProvider>
  );
};

export default App;
