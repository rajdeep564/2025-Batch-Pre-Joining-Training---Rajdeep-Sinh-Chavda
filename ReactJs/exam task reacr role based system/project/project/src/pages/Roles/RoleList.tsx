import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, message, Form, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { rolesApi, permissionsApi } from "../../api/api";
import { Role, Permission } from "../../types";
import { usePermission } from "../../contexts/PermissionContext";
import PermissionModal from "./PermissionModal";
import { useAuth } from "../../contexts/AuthContext";

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          rolesApi.getAll(),
          permissionsApi.getAll()
        ]);
        setRoles(rolesResponse.data);
        setPermissions(permissionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch roles and permissions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this role?",
      onOk: async () => {
        try {
          await rolesApi.delete(id);
          setRoles(roles.filter(role => role.id !== id));
          message.success("Role deleted successfully");
        } catch (error) {
          console.error("Error deleting role:", error);
          message.error("Failed to delete role");
        }
      }
    });
  };

  const handlePermissionsSaved = (updatedPermissions: Permission[]) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        updatedPermissions.find((updatedPerm) => updatedPerm.id === perm.id) || perm
      )
    );
    setIsModalOpen(false);
    message.success("Permissions updated successfully");
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleAddRole = async () => {
    try {
      const values = await form.validateFields();
      const newRole = { id: generateUniqueId(), ...values };
      const createdRole = await rolesApi.create(newRole);
      setRoles([...roles, createdRole.data]);

      const defaultPermissions = [
        "users",
        "employees",
        "projects",
        "roles"
      ].map((module, index) => ({
        id: Date.now() + index, 
        roleId: createdRole.data.id,
        module,
        view: true,
        add: true,
        edit: true,
        delete: true
      }));

      await Promise.all(defaultPermissions.map(permission => permissionsApi.create(permission)));

      setPermissions([...permissions, ...defaultPermissions]);
      setIsAddRoleModalOpen(false);
      setSelectedRole(createdRole.data);
      setIsModalOpen(true);
      form.resetFields();
    } catch (error) {
      console.error("Error adding role:", error);
      message.error("Failed to add role");
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <strong>{name}</strong>
    },
    {
      title: "Actions",
      key: "actions",
      render: (role: Role) => (
        <div className="space-x-2">
          {hasPermission("roles", "edit") && user?.roleId !== role.id && (
            <Button icon={<EditOutlined />} onClick={() => handleEditRole(role)}>
              Edit Permissions
            </Button>
          )}
          {hasPermission("roles", "delete") && user?.roleId !== role.id && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteRole(role.id)}>
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Roles</h1>
          <p className="mt-1 text-sm text-gray-500">Manage system roles and their permissions</p>
        </div>
        {user?.roleId == 1 && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddRoleModalOpen(true)}>
            Add Role
          </Button>
        )}
      </div>

      <div className="border border-gray-200 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ y: 350 }} 
          />
        )}
      </div>

      <Modal
        title={selectedRole ? `Edit Permissions for ${selectedRole.name}` : ""}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        {selectedRole && (
          <PermissionModal
            role={selectedRole}
            permissions={permissions.filter(p => String(p.roleId) == String(selectedRole.id))}
            onSave={handlePermissionsSaved}
            canEdit={user?.roleId == 1 && user?.roleId !== selectedRole.id}
          />
        )}
      </Modal>

      <Modal
        title="Add New Role"
        open={isAddRoleModalOpen}
        onCancel={() => setIsAddRoleModalOpen(false)}
        onOk={handleAddRole}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleList;