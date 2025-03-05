import React from "react";
import { Layout, Button } from "antd";
import { useTheme } from "../context/ThemeContext";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import styles from "./Layout.module.scss";

const { Header, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <h2>Product Management</h2>
        <Button onClick={toggleTheme} icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />} />
      </Header>
      <Content className={styles.content}>{children}</Content>
    </Layout>
  );
};

export default AppLayout;
