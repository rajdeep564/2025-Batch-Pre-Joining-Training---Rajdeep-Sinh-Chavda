import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../product/ProductContext";
import { Card, Typography, Button, Spin } from "antd";

const { Title, Text } = Typography;

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext)!;
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    setLoading(true); // Start loading when component mounts or id changes

    // Ensure products are available before searching for the product
    if (products && products.length > 0) {
      const foundProduct = products.find((p) => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    }
  }, [id, products]);

  // Show loader while waiting for products
  if (loading || !products.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
      </div>
    );
  }

  // If product is still not found after products have loaded, show error
  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Text type="danger" strong>
          Error: Product not found!
        </Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
        cover={
          <img
            src={`/assets/${product.image}`}
            alt={product.name}
            style={{padding:"15px", width: "100%", height: "300px", objectFit: "contain", borderRadius: "12px 12px 0 0" }}
            onError={(e) => (e.currentTarget.src = "/assets/default.png")} // Fallback image
          />
        }
      >
        <Title level={3}>{product.name}</Title>
        <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
          Price: ₹{product.price}
        </Text>
        <p style={{ marginTop: "10px", fontSize: "16px", color: "#555" }}>{product.description}</p>

        <Button type="primary" onClick={() => navigate("/products")} style={{ marginTop: "16px" }}>
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default ProductView;
