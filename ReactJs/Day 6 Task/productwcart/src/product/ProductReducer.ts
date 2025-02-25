
import { ProductState, ProductAction, ProductActionTypes } from "./ProductTypes";

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const productReducer = (state = initialState, action: ProductAction): ProductState => {
    switch (action.type) {
      case ProductActionTypes.FETCH_PRODUCTS_REQUEST:
        return { ...state, loading: true, error: null };
  
      case ProductActionTypes.FETCH_PRODUCTS_SUCCESS:
        return { ...state, loading: false, products: action.payload };
  
      case ProductActionTypes.FETCH_PRODUCTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      case ProductActionTypes.EDIT_PRODUCT:
        return {
          ...state,
          products: state.products.map((product) =>
            product.id === action.payload.id ? { ...product, ...action.payload } : product
          ),
        };
  
      default:
        return state;
    }
  };
  
