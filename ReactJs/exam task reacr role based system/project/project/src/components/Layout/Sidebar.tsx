import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, TeamOutlined, ProjectOutlined, SafetyOutlined } from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import { usePermission } from "../../contexts/PermissionContext";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { hasPermission } = usePermission();
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard", label: "Dashboard", icon: <HomeOutlined />, path: "/dashboard", alwaysShow: true },
    { key: "/users", label: "Users", icon: <UserOutlined />, path: "/users", module: "users", action: "view" as const },
    { key: "/employees", label: "Employees", icon: <TeamOutlined />, path: "/employees", module: "employees", action: "view" as const },
    { key: "/projects", label: "Projects", icon: <ProjectOutlined />, path: "/projects", module: "projects", action: "view" as const },
    { key: "/roles", label: "Roles & Permissions", icon: <SafetyOutlined />, path: "/roles", module: "roles", action: "view" as const },
  ];

  const filteredItems = menuItems
    .filter((item) => item.alwaysShow || (item.module && hasPermission(item.module, item.action)))
    .map((item) => ({
      key: item.key,
      icon: item.icon,
      label: <NavLink to={item.path}>{item.label}</NavLink>,
    }));

  return (
    <Sider collapsible collapsed={collapsed} theme="dark">
      <div className="logo" style={{ padding: "16px", textAlign: "center", color: "white", fontSize: "18px" }}>
        RBAC System
      </div>
      <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={filteredItems} />
    </Sider>
  );
};

export default Sidebar;