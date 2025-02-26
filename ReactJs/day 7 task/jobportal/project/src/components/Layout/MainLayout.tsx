import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FolderOutlined,
  FileSearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/jobs',
      icon: <FolderOutlined />,
      label: 'Jobs',
      onClick: () => navigate('/jobs'),
    },
    {
      key: '/applications',
      icon: <FileSearchOutlined />,
      label: 'My Applications',
      onClick: () => navigate('/applications'),
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: '/admin/add-job',
            icon: <PlusOutlined />,
            label: 'Add Job',
            onClick: () => navigate('/admin/add-job'),
          },
        ]
      : []),
  ];

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider collapsible collapsed={collapsed} trigger={null} style={{ height: '100vh', position: 'fixed', left: 0 }}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: 16, width: 64, height: 64 }} />
          <Button onClick={handleLogout} style={{ marginRight: 16 }}>Logout</Button>
        </Header>
        <Content style={{ padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
