import React from "react";
import { Layout, Menu, Typography, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    // Redirect to login page
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/products",
      label: "Products",
      onClick: () => navigate("/products"),
    },
    {
      key: "/users",
      label: "Users",
      onClick: () => navigate("/users"),
    },
  ];

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* App Title */}
      <Title level={3} style={{ color: "#fff", margin: 0 }}>
        Product Management
      </Title>

      {/* Updated Navigation Menu using 'items' prop */}
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/products"]}
        items={menuItems}
        style={{ flex: 1, minWidth: 0, justifyContent: "center" }}
      />

      {/* Logout Button */}
      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
};

export default AppHeader;
