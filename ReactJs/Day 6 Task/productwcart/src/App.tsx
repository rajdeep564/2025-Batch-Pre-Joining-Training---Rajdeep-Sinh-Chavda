import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router";
import { ProductProvider } from "./product/ProductContext"; // ✅ Import ProductProvider first
import { CartProvider } from "./cart/CartContext"; 
import "./App.css";

const App: React.FC = () => {
  return (
    <ProductProvider> {/* ✅ Wrap ProductProvider first */}
      <CartProvider> {/* ✅ Then wrap CartProvider */}
        <RouterProvider router={router} />
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
