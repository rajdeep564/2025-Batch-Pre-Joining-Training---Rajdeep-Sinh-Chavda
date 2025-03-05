import React, { useState, useEffect } from "react";
import { Table, Button, Card, Input, Modal, Space, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from "@ant-design/icons";
import moment from "moment";
import { projectsApi } from "../../api/api";
import { Project } from "../../types";
import { usePermission } from "../../contexts/PermissionContext";
import ProjectForm from "./ProjectForm";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await projectsApi.getAll();
        setProjects(data);
        setFilteredProjects(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error("Failed to fetch projects.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = projects.filter((project) => 
      project.name.toLowerCase().includes(searchTerm)
    );
    setFilteredProjects(filtered);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      onOk: async () => {
        try {
          await projectsApi.delete(id);
          setProjects(projects.filter((project) => project.id !== id));
          setFilteredProjects(filteredProjects.filter((project) => project.id !== id));
          message.success("Project deleted successfully");
        } catch (error) {
          console.error("Error deleting project:", error);
          message.error("Failed to delete project.");
        }
      },
    });
  };

  const handleProjectSaved = (savedProject: Project) => {
    if (selectedProject) {
      setProjects(projects.map((project) => (project.id === savedProject.id ? savedProject : project)));
      setFilteredProjects(filteredProjects.map((project) => (project.id === savedProject.id ? savedProject : project)));
      message.success("Project updated successfully!");
    } else {
      setProjects([...projects, savedProject]);
      setFilteredProjects([...filteredProjects, savedProject]);
      message.success("New project added successfully!");
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span>
          <FolderOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => moment(date).format("MMMM Do, YYYY"), // Format the date
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => moment(date).format("MMMM Do, YYYY"), // Format the date
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, project: Project) => (
        <Space>
          {hasPermission("projects", "edit") && (
            <Button icon={<EditOutlined />} onClick={() => handleEditProject(project)} />
          )}
          {hasPermission("projects", "delete") && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProject(project.id)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage company projects</p>
        </div>
        {hasPermission("projects", "add") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProject}>
            Add Project
          </Button>
        )}
      </div>

      <Card>
        <Input.Search placeholder="Search projects..." onChange={handleSearch} style={{ marginBottom: 16 }} />
        <Table columns={columns} dataSource={filteredProjects} rowKey="id" loading={isLoading} bordered scroll={{ y: 350 }} />
      </Card>

      <ProjectForm
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleProjectSaved}
      />
    </div>
  );
};

export default ProjectList;