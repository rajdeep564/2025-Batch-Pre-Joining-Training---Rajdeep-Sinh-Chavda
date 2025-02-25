import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../product/ProductContext";
import ProductForm from "../components/ProductForm";
import { Card, Spin, Typography, Button } from "antd";

const { Title, Text } = Typography;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(ProductContext);

  if (!context) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Text type="danger" strong>
          Error: Product context not found! Ensure ProductProvider wraps the component tree.
        </Text>
      </div>
    );
  }

  const { products, updateProduct } = context;
  const product = products.find((p) => p.id === id);

  const handleUpdate = (updatedProduct: Product) => {
    if (!updateProduct) {
      console.error("updateProduct function is undefined!");
      return;
    }

    updateProduct(id, updatedProduct);
    navigate("/products");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <Card
        title={<Title level={3}>Edit Product</Title>}
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {product ? (
          <ProductForm initialValues={product} onSubmit={handleUpdate} />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <Text type="secondary">Loading Product...</Text>
            <br />
            <Button type="primary" onClick={() => navigate("/products")} style={{ marginTop: "16px" }}>
              Go Back
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductEdit;
