import React from "react";
import { Table } from "antd";
import { useAuth } from "../context/AuthContext";

const Users: React.FC = () => {
  const { users } = useAuth();

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { 
      title: "Registered Date", 
      dataIndex: "registeredAt", 
      key: "registeredAt",
      render: (date: string) => new Date(date).toLocaleString()
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Registered Users</h2>
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="email" 
        pagination={{ pageSize: 5 }} 
      />
    </div>
  );
};

export default Users;
