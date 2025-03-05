import React, { useState, useEffect } from "react";
import { Table, Button, Card, Input, Modal, Space, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { usersApi, rolesApi } from "../../api/api";
import { User, Role } from "../../types";
import { usePermission } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import UserForm from "./UserForm";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = usePermission();
  const { user: currentUser } = useAuth();
  const adminRoleId = 1; // Assuming the admin role ID is 1

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          usersApi.getAll(),
          rolesApi.getAll(),
        ]);
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data); // Initialize filtered users
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setSelectedUser(null); // Ensure form opens in "Add User" mode
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      onOk: async () => {
        try {
          await usersApi.delete(id);
          setUsers((prev) => prev.filter((user) => user.id !== id));
          setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
          message.success("User deleted successfully.");
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete user.");
        }
      },
    });
  };

  const handleUserSaved = (savedUser: User) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) => (user.id === savedUser.id ? savedUser : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user.id === savedUser.id ? savedUser : user))
      );
      message.success("User updated successfully.");
    } else {
      const newUser = { ...savedUser, id: savedUser.id || Date.now() };
      setUsers((prev) => [...prev, newUser]);
      setFilteredUsers((prev) => [...prev, newUser]);
      message.success("User added successfully.");
    }
    setIsModalOpen(false);
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown";
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
      render: (roleId: number) => getRoleName(roleId),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, user: User) => (
        <Space>
          {hasPermission("users", "edit") && (user.roleId !== adminRoleId || user.id === currentUser?.id) && (
            <Button icon={<EditOutlined />} onClick={() => handleEditUser(user)} />
          )}
          {hasPermission("users", "delete") && user.id !== currentUser?.id && user.roleId !== adminRoleId && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteUser(user.id)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage system users and their roles</p>
        </div>
        {hasPermission("users", "add") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
            Add User
          </Button>
        )}
      </div>

      <Card>
        <Input.Search placeholder="Search users..." onChange={handleSearch} style={{ marginBottom: 16 }} />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={isLoading}
          bordered
          scroll={{ y: 350 }} // Set the height for the scrollable table body
        />
      </Card>

      <Modal
        title={selectedUser ? "Edit User" : "Add New User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <UserForm
          user={selectedUser}
          roles={roles}
          onSave={handleUserSaved}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default UserList;