import React, { useEffect } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { User, Role } from "../../types";
import { hashPassword } from "../../utils/auth";
import { usersApi } from "../../api/api";

interface UserFormProps {
  user: User | null;
  roles: Role[];
  onSave: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, roles, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name || "",
      email: user?.email || "",
      roleId: user?.roleId || undefined,
      password: "",
    });
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser: Partial<User> = { ...values };

      if (values.password) {
        updatedUser.password = await hashPassword(values.password);
      } else {
        delete updatedUser.password;
      }

      let savedUser: User;
      if (user) {
        savedUser = { ...user, ...updatedUser };
        await usersApi.update(user.id, updatedUser);
        message.success("User updated successfully!");
      } else {
        const existingUsers = await usersApi.getByEmail(values.email);
        if (existingUsers.data.length > 0) {
          message.error("A user with this email already exists.");
          return;
        }

        const newId = Date.now(); 
        savedUser = { 
          id: newId, 
          name: updatedUser.name!, 
          email: updatedUser.email!, 
          roleId: updatedUser.roleId!, 
          password: updatedUser.password 
        };
        await usersApi.create(savedUser);
       
      }

      onSave(savedUser);
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("An error occurred while saving the user.");
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="roleId"
        label="Role"
        rules={[{ required: true, message: "Please select a role" }]}
      >
        <Select>
          {roles.map((role) => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={
          user
            ? [] // ✅ Password is optional when updating
            : [{ required: true, message: "Please enter a password" }] // ✅ Required only when adding a new user
        }
      >
        <Input.Password placeholder={user ? "Leave blank to keep current password" : "Enter password"} />
      </Form.Item>

      <Button type="primary" onClick={handleSubmit}>
        Save
      </Button>
    </Form>
  );
};

export default UserForm;
