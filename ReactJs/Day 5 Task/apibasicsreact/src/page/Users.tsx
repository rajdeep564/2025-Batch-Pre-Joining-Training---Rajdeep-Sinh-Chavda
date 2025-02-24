import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../service/apiService';
import CustomTable from '../components/Table';
import { Typography } from 'antd';

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Users</Title>
      <CustomTable data={users} columns={columns} />
    </div>
  );
};

export default Users;