import React from "react";
import { Layout, Typography } from "antd";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "10vh",
        background: "#1890ff",
        padding: "10px 20px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        color: "#fff",
      }}
    >
      <Title level={3} style={{ margin: 0, color: "#fff" }}>
        Product Management
      </Title>
    </Header>
  );
};

export default AppHeader;