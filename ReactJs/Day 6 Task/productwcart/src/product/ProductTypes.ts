

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export enum ProductActionTypes {
  FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST",
  FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE",
  ADD_PRODUCT = "ADD_PRODUCT",
  EDIT_PRODUCT = "EDIT_PRODUCT",
  DELETE_PRODUCT = "DELETE_PRODUCT",
}


export interface FetchProductsRequestAction {
  type: ProductActionTypes.FETCH_PRODUCTS_REQUEST;
}

export interface FetchProductsSuccessAction {
  type: ProductActionTypes.FETCH_PRODUCTS_SUCCESS;
  payload: Product[];
}

export interface FetchProductsFailureAction {
  type: ProductActionTypes.FETCH_PRODUCTS_FAILURE;
  payload: string;
}

export interface AddProductAction {
  type: ProductActionTypes.ADD_PRODUCT;
  payload: Product;
}

export interface EditProductAction {
  type: ProductActionTypes.EDIT_PRODUCT;
  payload: Product;
}

export interface DeleteProductAction {
  type: ProductActionTypes.DELETE_PRODUCT;
  payload: string; 
}

export type ProductAction =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction
  | AddProductAction
  | EditProductAction
  | DeleteProductAction;
