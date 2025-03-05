import React, { useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Modal } from "antd";
import moment from "moment";
import { Project } from "../../types";
import { projectsApi } from "../../api/api";

const { Option } = Select;

interface ProjectFormProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isOpen, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        startDate: project.startDate ? moment(project.startDate) : null,
        endDate: project.endDate ? moment(project.endDate) : null,
        status: project.status,
        manager: project.manager,
      });
    } else {
      form.resetFields();
    }
  }, [project, form]);

  const statuses = ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"];

  const handleSubmit = async (values: Project) => {
    setIsSubmitting(true);
    try {
      let savedProject;
      if (project) {
        const { data: updatedProject } = await projectsApi.update(project.id, values);
        savedProject = updatedProject;
      } else {
        const { data: newProject } = await projectsApi.create(values);
        savedProject = newProject;
      }
      onSave(savedProject);
      
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={project ? "Edit Project" : "Add New Project"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Project Name" rules={[{ required: true, message: "Project name is required" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: "Start date is required" }]}>
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: "End date is required" }]}>
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status is required" }]}>
          <Select>
            {statuses.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="manager" label="Project Manager" rules={[{ required: true, message: "Project manager is required" }]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Save Project
            </Button>
          </div>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ProjectForm;
