import React, { ReactNode } from "react";
import { ProductProvider } from "./ProductContext";

interface ProductWrapperProps {
  children: ReactNode;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ children }) => {
  return <ProductProvider>{children}</ProductProvider>;
};

export default ProductWrapper;
