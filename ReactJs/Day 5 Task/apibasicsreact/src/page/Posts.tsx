import React, { useEffect, useState, useCallback } from 'react';
import { fetchPosts } from '../service/apiService';
import CustomTable from '../components/Table';
import { Typography, Card, Spin } from 'antd';

const { Title } = Typography;

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Body', dataIndex: 'body', key: 'body', ellipsis: true },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40, backgroundColor: '#f9f9f9' }}>
       <CustomTable data={posts} columns={columns} />
      
    </div>
  );
};

export default Posts;