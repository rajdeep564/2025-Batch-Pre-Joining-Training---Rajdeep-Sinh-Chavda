import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  PlusOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (val: boolean) => void }> = ({
  collapsed,
  setCollapsed,
}) => {
  const location = useLocation();

  const items = [
    {
      key: "sub1",
      label: "Products",
      icon: <AppstoreOutlined />,
      children: [
        { key: "/products", label: <Link to="/products">View Products</Link> },
        { key: "/add-product", label: <Link to="/add-product">Add Product</Link>, icon: <PlusOutlined /> },
      ],
    },
    {
      key: "/users",
      label: <Link to="/users">Users</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={240}
      style={{ minHeight: "100vh", background: "#001529" }}
    >
      <div style={{ display:"flex", justifyContent : "center" , padding: "10px", textAlign: "center", color: "#fff", fontSize: "18px" }}>
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(true)} />
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        defaultOpenKeys={["sub1"]}
        style={{ fontSize: "16px" }}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
