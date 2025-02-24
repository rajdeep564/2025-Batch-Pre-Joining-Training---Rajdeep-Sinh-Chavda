import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Product } from "./Products";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const product = useMemo(() => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    return products.find((p: Product) => p.id === Number(id));
  }, [id]);

  return (
    <>
      <h2>Product Details</h2>
      <p>
        <strong>ID:</strong> {product?.id}
      </p>
      <p>
        <strong>Name:</strong> {product?.name}
      </p>
      <p>
        <strong>Price:</strong> ₹{product?.price}
      </p>
      <p>
        <strong>Category:</strong> {product?.category}
      </p>
    </>
  );
};

export default ViewProduct;
