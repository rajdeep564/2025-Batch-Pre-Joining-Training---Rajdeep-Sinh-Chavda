import { CartAction, Product } from "../cart/CartTypes";


export const addToCart = (product: Product): CartAction => ({
  type: "ADD_TO_CART",
  payload: product,
});


export const removeFromCart = (productId: string): CartAction => ({
  type: "REMOVE_FROM_CART",
  payload: productId,
});


export const clearCart = (): CartAction => ({
  type: "CLEAR_CART",
});


export const increaseQuantity = (productId: string): CartAction => ({
  type: "INCREASE_QUANTITY",
  payload: productId,
});


export const decreaseQuantity = (productId: string): CartAction => ({
  type: "DECREASE_QUANTITY",
  payload: productId,
});
