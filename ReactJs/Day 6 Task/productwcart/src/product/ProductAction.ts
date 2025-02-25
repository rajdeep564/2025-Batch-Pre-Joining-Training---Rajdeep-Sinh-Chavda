import { Product, ProductAction } from "../product/ProductTypes";


export const setProducts = (products: Product[]): ProductAction => ({
  type: "SET_PRODUCTS",
  payload: products,
});

export const addProduct = (product: Product): ProductAction => ({
  type: "ADD_PRODUCT",
  payload: product,
});

export const updateProduct = (product: Product): ProductAction => ({
  type: "UPDATE_PRODUCT",
  payload: product,
});


export const deleteProduct = (productId: string): ProductAction => ({
  type: "DELETE_PRODUCT",
  payload: productId,
});
