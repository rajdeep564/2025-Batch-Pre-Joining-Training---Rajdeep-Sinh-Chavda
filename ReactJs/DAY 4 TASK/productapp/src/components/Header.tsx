import React from 'react';
import { Layout, Menu, Breadcrumb, Typography, theme } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '1', label: 'Home' },
  { key: '2', label: 'Products' },
  { key: '3', label: 'Orders' },
];

const AppHeader: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: '#1890ff',
        padding: '0 20px',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      {/* App Title */}
      <Title level={3}>
        Product Management
      </Title>

      {/* Navigation Menu */}
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} style={{ flex: 1, minWidth: 0 }} />
    </Header>
  );
};

export default AppHeader;
