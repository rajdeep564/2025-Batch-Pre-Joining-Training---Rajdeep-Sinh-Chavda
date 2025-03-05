import React, { useState, useEffect } from "react";
import { Table, Checkbox, Button, message } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { Role, Permission } from "../../types";
import { permissionsApi } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

interface PermissionModalProps {
  role: Role;
  permissions: Permission[];
  onSave: (permissions: Permission[]) => void;
  canEdit: boolean;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ role, permissions, onSave, canEdit }) => {
  const { user } = useAuth();
  const [updatedPermissions, setUpdatedPermissions] = useState<Permission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modules = ["users", "employees", "projects", "roles"];
  const actions = ["view", "add", "edit", "delete"];

  useEffect(() => {
    const initializedPermissions = modules.map((module) => {
      return (
        permissions.find((p) => p.module === module) || {
          id: 0,
          roleId: role.id,
          module,
          view: false,
          add: false,
          edit: false,
          delete: false,
        }
      );
    });

    setUpdatedPermissions(initializedPermissions);
  }, [permissions, role]);

  const handlePermissionChange = (
    permissionId: number | null,
    module: string,
    action: "view" | "add" | "edit" | "delete",
    value: boolean
  ) => {
    setUpdatedPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.module === module
          ? {
              ...perm,
              [action]: value,
              ...(action === "view" && !value ? { add: false, edit: false, delete: false } : {}),
            }
          : perm
      )
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(
        updatedPermissions.map((permission) =>
          permission.id
            ? permissionsApi.update(permission.id, permission)
            : permissionsApi.create(permission)
        )
      );
      onSave(updatedPermissions);
      message.success("Permissions updated successfully");
    } catch (error) {
      console.error("Error saving permissions:", error);
      message.error("Failed to update permissions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <SafetyOutlined className="text-xl mr-2" />
        <div>
          <h3 className="text-lg font-medium">{role.name}</h3>
          <p className="text-sm text-gray-500">Configure permissions for this role</p>
        </div>
      </div>

      <Table
        dataSource={updatedPermissions}
        pagination={false}
        rowKey="module"
      >
        <Table.Column title="Module" dataIndex="module" key="module" />
        {actions.map((action) => (
          <Table.Column
            key={action}
            title={action.charAt(0).toUpperCase() + action.slice(1)}
            render={(record: Permission) => (
              <Checkbox
                checked={record[action as keyof Permission] as boolean}
                onChange={(e) =>
                  handlePermissionChange(
                    record.id,
                    record.module,
                    action as "view" | "add" | "edit" | "delete",
                    e.target.checked
                  )
                }
                disabled={!canEdit || (action !== "view" && !record.view) || user?.roleId === role.id}
              />
            )}
          />
        ))}
      </Table>

      {canEdit && user?.roleId !== role.id && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} type="primary" loading={isSubmitting}>
            Save Permissions
          </Button>
        </div>
      )}
    </>
  );
};

export default PermissionModal;