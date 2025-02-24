import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", width: "100vw", background: "#f0f2f5" }}>
      <Sidebar />
      <Layout style={{ flex: 1 }}>
        <Header />
        <Content
          style={{
            
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",

            height: "90vh",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;