import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Empty } from "antd";
import { Product } from "../Products";

const { Title, Text } = Typography;

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = useMemo(() => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    return products.find((p: Product) => p.id === Number(id));
  }, [id]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      {product ? (
        <Card
          style={{
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            padding: "20px",
          }}
          bordered={false}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
            Product Details
          </Title>
          <p>
            <Text strong>ID:</Text> {product.id}
          </p>
          <p>
            <Text strong>Name:</Text> {product.name}
          </p>
          <p>
            <Text strong>Price:</Text> ₹{product.price}
          </p>
          <p>
            <Text strong>Category:</Text> {product.category}
          </p>
          <Button
            type="primary"
            block
            onClick={() => navigate("/products")}
            style={{
              marginTop: "15px",
              fontSize: "16px",
              borderRadius: "6px",
              padding: "10px",
              backgroundColor: "#1890ff",
              border: "none",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#40a9ff")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1890ff")}
          >
            Back to Products
          </Button>
        </Card>
      ) : (
        <Empty
          description="Product Not Found"
          style={{ textAlign: "center" }}
        />
      )}
    </div>
  );
};

export default ViewProduct;
