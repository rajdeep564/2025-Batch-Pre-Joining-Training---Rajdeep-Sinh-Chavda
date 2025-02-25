import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "../components/Header"; // Import Header
import Sidebar from "../components/Sidebar"; // Import Sidebar

const { Content } = Layout;

const AppLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
   
      <Sidebar/>

      <Layout>
    
        <AppHeader />

     
        <Content
          style={{
            padding: "30px",
            margin: "0 auto",
            width: "100%",
            
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
