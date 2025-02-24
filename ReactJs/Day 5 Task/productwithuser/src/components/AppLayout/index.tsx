import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../Sidebar";
import AppHeader from "../Header"; // Updated header with navigation
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw", background: "#f0f2f5", overflow: "hidden" }}>
      {/* Fixed Sidebar */}
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#001529",
          zIndex: 1000,
        }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </Layout.Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: "margin-left 0.3s ease" }}>
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
