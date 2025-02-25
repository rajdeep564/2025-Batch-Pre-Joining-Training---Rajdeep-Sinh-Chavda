import React, { useEffect, useState } from "react";
import { Table, Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<{ name: string; email: string;  }[]>([]);

  useEffect(() => {
    
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);


  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card
        style={{ width: "90%", maxWidth: "1000px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <Title level={3} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <UserOutlined /> Registered Users
        </Title>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="email"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default Users;
