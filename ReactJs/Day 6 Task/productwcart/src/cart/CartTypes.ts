export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  cart: CartItem[];
  totalAmount: number;
}

export enum CartActionTypes {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  INCREMENT_QUANTITY = "INCREMENT_QUANTITY",
  DECREMENT_QUANTITY = "DECREMENT_QUANTITY",
  CLEAR_CART = "CLEAR_CART",
  UPDATE_PRODUCTS_IN_CART = "UPDATE_PRODUCTS_IN_CART",
  DELETE_PRODUCT = "DELETE_PRODUCT",
}

export type CartAction =
  | { type: CartActionTypes.ADD_TO_CART; payload: CartItem }
  | { type: CartActionTypes.REMOVE_FROM_CART; payload: string }
  | { type: CartActionTypes.INCREMENT_QUANTITY; payload: string }
  | { type: CartActionTypes.DECREMENT_QUANTITY; payload: string }
  | { type: CartActionTypes.CLEAR_CART }
  | { type: CartActionTypes.UPDATE_PRODUCTS_IN_CART; payload: CartItem[] }
  | { type: CartActionTypes.DELETE_PRODUCT; payload: string };

export interface CartContextType {
  state: CartState;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  deleteProductFromCart: (productId: string) => void;
}
