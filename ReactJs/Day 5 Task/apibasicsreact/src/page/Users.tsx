import React, { useEffect, useState, useCallback } from 'react';
import { fetchUsers } from '../service/apiService';
import CustomTable from '../components/Table';
import { Typography, Card, Spin } from 'antd';

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40, backgroundColor: '#f9f9f9' }}>
    <CustomTable data={users} columns={columns} />

    </div>
  );
};

export default Users;
