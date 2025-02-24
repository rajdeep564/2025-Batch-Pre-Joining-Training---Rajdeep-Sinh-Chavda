import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AppstoreOutlined, PlusOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation(); 

  return (
    <Sider width={240} style={{ minHeight: "100vh", background: "#001529" }}>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]} 
        style={{ fontSize: "16px" }}
      >
        <Menu.Item key="/products" icon={<AppstoreOutlined />}>
          <Link to="/products">Products</Link>
        </Menu.Item>
        <Menu.Item key="/add-product" icon={<PlusOutlined />}>
          <Link to="/add-product">Add Product</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
