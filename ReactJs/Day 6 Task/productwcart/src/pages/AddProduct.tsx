import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../product/ProductContext";
import ProductForm from "../components/ProductForm";
import { Card, Typography, Button } from "antd";
import { Product } from "../product/ProductTypes";

const { Title, Text } = Typography;

const ProductAdd: React.FC = () => {
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

  const { addProduct } = context;

  const handleAdd = (newProduct: Omit<Product, "id">) => {
    if (!addProduct) {
      console.error("addProduct function is undefined!");
      return;
    }

    addProduct(newProduct);
    navigate("/products");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <Card
        title={<Title level={3}>Add New Product</Title>}
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <ProductForm
          initialValues={{ name: "", price: "", description: "" }}
          onSubmit={(formData) => handleAdd(formData)}
        />
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Button type="default" onClick={() => navigate("/products")}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductAdd;
