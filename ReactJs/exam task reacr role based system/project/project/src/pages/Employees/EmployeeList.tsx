import React, { useState, useEffect } from "react";
import { Table, Button, Card, Input, Modal, Space, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { employeesApi } from "../../api/api";
import { Employee } from "../../types";
import { usePermission } from "../../contexts/PermissionContext";
import EmployeeForm from "./EmployeeForm";

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data } = await employeesApi.getAll();
        setEmployees(data);
        setFilteredEmployees(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching employees:", error);
        message.error("Failed to fetch employees.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this employee?",
      onOk: async () => {
        try {
          await employeesApi.delete(id);
          setEmployees((prev) => prev.filter((employee) => employee.id !== id));
          setFilteredEmployees((prev) => prev.filter((employee) => employee.id !== id));
          message.success("Employee deleted successfully.");
        } catch (error) {
          console.error("Error deleting employee:", error);
          message.error("Failed to delete employee.");
        }
      },
    });
  };

  const handleEmployeeSaved = (savedEmployee: Employee) => {
    if (selectedEmployee) {
      setEmployees((prev) =>
        prev.map((employee) => (employee.id === savedEmployee.id ? savedEmployee : employee))
      );
      setFilteredEmployees((prev) =>
        prev.map((employee) => (employee.id === savedEmployee.id ? savedEmployee : employee))
      );
      message.success("Employee updated successfully.");
    } else {
      setEmployees((prev) => [...prev, savedEmployee]);
      setFilteredEmployees((prev) => [...prev, savedEmployee]);
      message.success("Employee added successfully.");
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date: string) => moment(date).format("MMMM Do, YYYY"), // Format the date
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, employee: Employee) => (
        <Space>
          {hasPermission("employees", "edit") && (
            <Button icon={<EditOutlined />} onClick={() => handleEditEmployee(employee)} />
          )}
          {hasPermission("employees", "delete") && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteEmployee(employee.id)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">Manage company employees</p>
        </div>
        {hasPermission("employees", "add") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEmployee}>
            Add Employee
          </Button>
        )}
      </div>

      <Card>
        <Input.Search placeholder="Search employees..." onChange={handleSearch} style={{ marginBottom: 16 }} />
        <Table columns={columns} dataSource={filteredEmployees} rowKey="id" loading={isLoading} bordered scroll={{ y: 350 }} />
      </Card>

      <EmployeeForm
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEmployeeSaved}
      />
    </div>
  );
};

export default EmployeeList;