import React from 'react';
import Users from './page/Users';
import Posts from './page/Posts';
import { Layout } from 'antd';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', padding: 20, backgroundColor: '#f0f2f5' }}>
      <Content>
        <Users />
        <div style={{ margin: '40px 0' }} />
        <Posts />
      </Content>
    </Layout>
  );
};

export default App;