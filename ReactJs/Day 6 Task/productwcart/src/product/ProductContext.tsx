import React, { createContext, useReducer, useEffect, useContext } from "react";
import { Product } from "../product/ProductTypes";
import productsData from "../data/products.json";
import { ProductState, ProductActionTypes } from "./ProductTypes";
import { productReducer } from "../product/ProductReducer";

interface ProductContextType extends ProductState {
  fetchProducts: () => void;
  addProduct: (newProduct: Omit<Product, "id">) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    loading: false,
    error: null,
  });

  // 🔹 Fetch products from local storage (or initialize from JSON)
  const fetchProducts = () => {
    dispatch({ type: ProductActionTypes.FETCH_PRODUCTS_REQUEST });

    try {
      let storedProducts = localStorage.getItem("products");
      if (!storedProducts) {
        localStorage.setItem("products", JSON.stringify(productsData));
        storedProducts = JSON.stringify(productsData);
      }

      const products = JSON.parse(storedProducts);
      dispatch({ type: ProductActionTypes.FETCH_PRODUCTS_SUCCESS, payload: products });
    } catch (error) {
      dispatch({ type: ProductActionTypes.FETCH_PRODUCTS_FAILURE, payload: "Failed to load products" });
    }
  };

  // 🔹 Add product and update local storage
  const addProduct = (newProduct: Omit<Product, "id">) => {
    const productWithId = {
      ...newProduct,
      id: Date.now().toString(),
      path: newProduct.path || "/default-image.png",
    };

    const updatedProducts = [...state.products, productWithId];
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    dispatch({ type: ProductActionTypes.ADD_PRODUCT, payload: productWithId });
  };

  // ✅ Live Update: Update product in both products list and cart
  const updateProduct = (id: string, updatedProduct: Product) => {
    const updatedProducts = state.products.map((product) =>
      product.id === id ? { ...updatedProduct, id } : product
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // 🔹 Live Update: Update product in the cart
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cart.map((item: Product) =>
      item.id === id ? { ...updatedProduct, id } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    dispatch({ type: ProductActionTypes.EDIT_PRODUCT, payload: updatedProduct });

    // 🔹 Notify other components of the update
    window.dispatchEvent(new Event("storage"));
  };

  // ✅ Live Deletion: Delete product from both products list and cart
  const deleteProduct = (id: string) => {
    dispatch({ type: ProductActionTypes.FETCH_PRODUCTS_REQUEST });

    try {
      const updatedProducts = state.products.filter((product) => product.id !== id);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      // 🔹 Live Deletion: Remove the product from the cart
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.filter((item: Product) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      dispatch({ type: ProductActionTypes.DELETE_PRODUCT, payload: id });

      // 🔹 Notify other components of the update
      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        fetchProducts();
      }, 500);
    } catch (error) {
      dispatch({ type: ProductActionTypes.FETCH_PRODUCTS_FAILURE, payload: "Failed to delete product" });
    }
  };

  useEffect(() => {
    fetchProducts();

    // ✅ Listen for storage updates (ensures real-time sync)
    const handleStorageChange = () => {
      fetchProducts();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ProductContext.Provider value={{ ...state, fetchProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
