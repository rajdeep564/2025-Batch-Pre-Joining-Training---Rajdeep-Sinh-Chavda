import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import { Users, Briefcase, FolderKanban, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usersApi, employeesApi, projectsApi, rolesApi } from '../api/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // State for storing counts
  const [stats, setStats] = useState({
    users: 0,
    employees: 0,
    projects: 0,
    roles: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all counts in parallel
        const [usersRes, employeesRes, projectsRes, rolesRes] = await Promise.all([
          usersApi.getAll(),
          employeesApi.getAll(),
          projectsApi.getAll(),
          rolesApi.getAll(),
        ]);

        setStats({
          users: usersRes.data.length,
          employees: employeesRes.data.length,
          projects: projectsRes.data.length,
          roles: rolesRes.data.length,
        });

        setLoading(false);
      } catch  {
        setError('Failed to fetch dashboard stats. Please try again.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Define statistics cards
  const statCards = [
    {
      title: 'Users',
      value: stats.users,
      icon: <Users size={24} className="text-blue-500" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Employees',
      value: stats.employees,
      icon: <Briefcase size={24} className="text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: <FolderKanban size={24} className="text-yellow-500" />,
      color: 'bg-yellow-100',
    },
    {
      title: 'Roles',
      value: stats.roles,
      icon: <Shield size={24} className="text-purple-500" />,
      color: 'bg-purple-100',
    },
  ];

  // Role-based information
  const roleNames: Record<number, string> = {
    1: 'Admin',
    2: 'HR',
    3: 'Supervisor',
    4: 'Manager',
  };

  const roleDescriptions: Record<number, string> = {
    1: 'Full control; can manage users and permissions.',
    2: 'Can manage employees but not users or permissions.',
    3: 'Can only view and edit limited modules.',
    4: 'Can manage projects but not permissions.',
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      {/* Handle Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} bordered className="shadow-sm">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} mr-4`}>{stat.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="System Overview" bordered className="shadow-sm">
              <p className="text-gray-600">
                This RBAC (Role-Based Access Control) system demonstrates how to implement
                permission-based access in a React application. The system includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mt-2">
                <li>User authentication with JWT</li>
                <li>Role-based permissions</li>
                <li>Dynamic UI based on user permissions</li>
                <li>Protected routes and API calls</li>
              </ul>
            </Card>

            <Card title="Your Role Information" bordered className="shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-3">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Role</p>
                    <p className="text-lg font-medium text-gray-900">
                      {roleNames[user?.roleId || 0] || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Role Description:</p>
                  <p className="text-gray-600">
                    {roleDescriptions[user?.roleId || 0] || 'No description available.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
