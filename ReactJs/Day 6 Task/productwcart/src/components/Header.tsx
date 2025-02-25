import React from "react";
import { Layout, Menu, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { state } = useCart();

  const menuItems = [
    { key: "home", label: <Link to="/">Home</Link> },
    { key: "products", label: <Link to="/products">Products</Link> },
    { key: "cart", label: <Link to="/cart">Cart</Link> },
  ];

  return (
    <Header
      style={{
        background: "#001529",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
  
      <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          E-Commerce
        </Link>
      </div>

     
      <Menu
        mode="horizontal"
        items={menuItems}
        theme="dark"
        style={{
          width : "300px",
          background: "transparent",
          borderBottom: "none",
          fontSize: "16px",
          fontWeight: 500,
        }}
      />

     
      <div>
        <Link to="/cart">
          <Badge
            count={state.cart.length}
            showZero
            style={{
              backgroundColor: "#ff4d4f",
              fontSize: "12px",
              borderRadius: "8px",
            }}
          >
            <ShoppingCartOutlined
              style={{
                fontSize: "24px",
                color: "#fff",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4d4f")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
            />
          </Badge>
        </Link>
      </div>
    </Header>
  );
};

export default AppHeader;
