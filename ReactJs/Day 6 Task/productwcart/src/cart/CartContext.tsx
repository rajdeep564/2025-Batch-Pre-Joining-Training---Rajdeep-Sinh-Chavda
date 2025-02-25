import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { CartState, CartActionTypes, CartContextType, CartItem } from "./CartTypes";
import { cartReducer } from "./CartReducer";

// 🔹 Initial State
const initialState: CartState = {
  cart: [],
  totalAmount: 0,
};

// 🔹 Create Context
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 🔹 Fetch Cart from Local Storage (on mount)
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      dispatch({ type: CartActionTypes.LOAD_CART, payload: JSON.parse(storedCart) });
    }
  }, []);

  // 🔹 Save Cart to Local Storage (on state change)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  // ✅ Add Product to Cart
  const addToCart = (product: CartItem) => {
    dispatch({ type: CartActionTypes.ADD_TO_CART, payload: product });
  };

  // ✅ Remove Product from Cart
  const removeFromCart = (productId: string) => {
    dispatch({ type: CartActionTypes.REMOVE_FROM_CART, payload: productId });
  };

  // ✅ Increase Quantity
  const incrementQuantity = (productId: string) => {
    dispatch({ type: CartActionTypes.INCREMENT_QUANTITY, payload: productId });
  };

  // ✅ Decrease Quantity
  const decrementQuantity = (productId: string) => {
    dispatch({ type: CartActionTypes.DECREMENT_QUANTITY, payload: productId });
  };

  // ✅ Clear Entire Cart
  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  // ✅ Listen for Product Updates & Sync Cart
  useEffect(() => {
    const syncCartWithProducts = () => {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const updatedCart = state.cart
        .map((cartItem) => {
          const matchingProduct = products.find((p: CartItem) => p.id === cartItem.id);
          return matchingProduct ? { ...cartItem, ...matchingProduct } : null;
        })
        .filter(Boolean); // Remove deleted products

      dispatch({ type: CartActionTypes.LOAD_CART, payload: updatedCart });
    };

    window.addEventListener("storage", syncCartWithProducts);
    return () => window.removeEventListener("storage", syncCartWithProducts);
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 🔹 Custom Hook for Easy Access
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
