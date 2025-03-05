import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Modal, Button, message, Space } from "antd";
import dayjs from "dayjs";
import { Employee } from "../../types";
import { employeesApi } from "../../api/api";

interface EmployeeFormProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

const { Option } = Select;

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Management",
  "Operations",
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, isOpen, onClose, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
        joinDate: dayjs(employee.joinDate),
      });
    } else {
      form.resetFields();
    }
  }, [employee, form]);

  const onSubmit = async (values: { name: string; email: string; position: string; department: string; joinDate: dayjs.Dayjs }) => {
    try {
      const formattedValues = {
        ...values,
        joinDate: values.joinDate.format("YYYY-MM-DD"),
      };

      let savedEmployee;
      if (employee) {
        const { data: updatedEmployee } = await employeesApi.update(employee.id, formattedValues);
        savedEmployee = updatedEmployee;
      } else {
        const { data: newEmployee } = await employeesApi.create(formattedValues);
        savedEmployee = newEmployee;
      }

      onSave(savedEmployee);
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
      message.error("Failed to save employee.");
    }
  };

  return (
    <Modal open={isOpen} title={employee ? "Edit Employee" : "Add New Employee"} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="position" label="Position" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Select>{departments.map((dept) => <Option key={dept}>{dept}</Option>)}</Select>
        </Form.Item>

        <Form.Item name="joinDate" label="Join Date" rules={[{ required: true }]}>
          <DatePicker format="YYYY-MM-DD" className="w-full" />
        </Form.Item>

        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">Save Employee</Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
