import { CartState, CartAction, CartActionTypes, CartItem } from "./CartTypes";

const initialState: CartState = {
  cart: [],
  totalAmount: 0,
};

export const cartReducer = (state = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART:
      const existingItem = state.cart.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          totalAmount: state.totalAmount + action.payload.price,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
          totalAmount: state.totalAmount + action.payload.price,
        };
      }

    case CartActionTypes.REMOVE_FROM_CART:
      const updatedCart = state.cart.filter((item) => item.id !== action.payload);
      return {
        ...state,
        cart: updatedCart,
        totalAmount: updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

    case CartActionTypes.INCREMENT_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
        totalAmount: state.totalAmount + (state.cart.find((item) => item.id === action.payload)?.price || 0),
      };

    case CartActionTypes.DECREMENT_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
        totalAmount: state.totalAmount - (state.cart.find((item) => item.id === action.payload)?.price || 0),
      };

    case CartActionTypes.CLEAR_CART:
      return {
        cart: [],
        totalAmount: 0,
      };

    case CartActionTypes.UPDATE_PRODUCTS_IN_CART:
      const updatedProductsCart = state.cart
        .map((cartItem) => {
          const updatedProduct = action.payload.find((p: CartItem) => p.id === cartItem.id);
          return updatedProduct ? { ...cartItem, ...updatedProduct } : null; // Keep updated products only
        })
        .filter((item): item is CartItem => item !== null);

      return {
        ...state,
        cart: updatedProductsCart,
        totalAmount: updatedProductsCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

    case CartActionTypes.DELETE_PRODUCT:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
        totalAmount: state.cart
          .filter((item) => item.id !== action.payload)
          .reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

    default:
      return state;
  }
};
