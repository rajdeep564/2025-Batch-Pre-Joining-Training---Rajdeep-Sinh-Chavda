import React from "react";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const { Title, Text } = Typography;

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
        textAlign: "center",
      }}
    >
      <AlertCircle size={80} style={{ color: "#1890ff", marginBottom: "16px" }} />
      <Title level={2} style={{ color: "#333" }}>
        404 - Page Not Found
      </Title>
      <Text style={{ color: "#666", marginBottom: "24px" }}>
        Oops! The page you are looking for doesn't exist.
      </Text>
      <Link to="/products">
        <Button type="primary" size="large">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
