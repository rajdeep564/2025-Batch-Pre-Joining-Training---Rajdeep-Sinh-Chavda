import { Dispatch } from "react";

export interface CartContextType {
  state: CartState;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  clearCart: () => void;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
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
}

interface AddToCartAction {
  type: CartActionTypes.ADD_TO_CART;
  payload: CartItem;
}

interface RemoveFromCartAction {
  type: CartActionTypes.REMOVE_FROM_CART;
  payload: number;
}

interface IncrementQuantityAction {
  type: CartActionTypes.INCREMENT_QUANTITY;
  payload: number;
}

interface DecrementQuantityAction {
  type: CartActionTypes.DECREMENT_QUANTITY;
  payload: number;
}

interface ClearCartAction {
  type: CartActionTypes.CLEAR_CART;
}

export type CartAction =
  | AddToCartAction
  | RemoveFromCartAction
  | IncrementQuantityAction
  | DecrementQuantityAction
  | ClearCartAction;
