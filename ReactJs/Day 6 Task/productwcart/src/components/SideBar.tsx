import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileAddOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
      trigger={null}
      style={{
        minHeight: "100vh",
        background: "#001529", 
      }}
    >

      <div
        style={{
          textAlign: "center",
          padding: "16px",
          cursor: "pointer",
          color: "#fff",
          fontSize: "18px",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>


      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          { key: "1", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
          { key: "2", icon: <AppstoreOutlined />, label: <Link to="/products">Products</Link> },
          { key: "3", icon: <ShoppingCartOutlined />, label: <Link to="/cart">Cart</Link> },
          {key : "4" , icon :<FileAddOutlined/> , label :<Link to={"/addproduct"}>AddProduct</Link>}
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
