import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../service/apiService';
import CustomTable from '../components/Table';
import { Typography } from 'antd';

const { Title } = Typography;

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Body', dataIndex: 'body', key: 'body' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Posts</Title>
      <CustomTable data={posts} columns={columns} />
    </div>
  );
};

export default Posts;
