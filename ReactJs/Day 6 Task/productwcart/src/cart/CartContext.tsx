import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { CartState, CartActionTypes, CartContextType, CartItem } from "./CartTypes";
import { cartReducer } from "./CartReducer";
import { useProduct } from "../product/ProductContext"; 

const initialState: CartState = {
  cart: [],
  totalAmount: 0,
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { products } = useProduct(); // ✅ Get latest products from ProductContext

  // ✅ Sync Cart when Products Update (Includes Deletions)
  useEffect(() => {
    dispatch({ type: CartActionTypes.UPDATE_PRODUCTS_IN_CART, payload: products });
  }, [products]);

  const addToCart = (product: CartItem) => {
    dispatch({ type: CartActionTypes.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: CartActionTypes.REMOVE_FROM_CART, payload: productId });
  };

  const incrementQuantity = (productId: string) => {
    dispatch({ type: CartActionTypes.INCREMENT_QUANTITY, payload: productId });
  };

  const decrementQuantity = (productId: string) => {
    dispatch({ type: CartActionTypes.DECREMENT_QUANTITY, payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  const deleteProductFromCart = (productId: string) => {
    dispatch({ type: CartActionTypes.DELETE_PRODUCT, payload: productId });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        deleteProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
