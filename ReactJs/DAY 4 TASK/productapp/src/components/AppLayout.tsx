import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "../components/Header"; // Updated header with navigation
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw", background: "#f0f2f5" }}>
      {/* Sidebar with Collapsible Feature */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout style={{ flex: 1 }}>
        {/* Sticky Header with Navigation */}
        <AppHeader />
        
        {/* Main Content Area */}
        <Content
          style={{
            margin: "20px",
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
