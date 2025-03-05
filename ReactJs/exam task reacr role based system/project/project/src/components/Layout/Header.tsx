import React, { useState, useEffect } from "react";
import { Layout, Avatar, Button, Switch } from "antd";
import { UserOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme); 
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Header style={{ background: theme === "dark" ? "#141414" : "#fff", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff", marginRight: 8 }} />
        <span style={{ color: theme === "dark" ? "#fff" : "#000" }}>{user?.name}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          style={{ marginRight: 16 }}
        />
        <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;
