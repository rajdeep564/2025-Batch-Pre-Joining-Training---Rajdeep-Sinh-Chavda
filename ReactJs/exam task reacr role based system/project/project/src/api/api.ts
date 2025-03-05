import axios from 'axios';
import { User, Role, Permission, Employee, Project } from '../types';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  getByEmail: (email: string) => api.get<User[]>(`/users?email=${email}`),

  create: async (user: Omit<User, 'id'>) => {
    try {
      const existingUsers = await usersApi.getByEmail(user.email);

      if (existingUsers.data.length > 0) {
        throw new Error('A user with this email already exists.');
      }

      return api.post<User>('/users', user);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  update: (id: number, user: Partial<User>) => api.patch<User>(`/users/${id}`, user),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const rolesApi = {
  getAll: () => api.get<Role[]>('/roles'),
  getById: (id: number) => api.get<Role>(`/roles/${id}`),
  create: (role: Role) => api.post<Role>('/roles', role),
  update: (id: number, role: Partial<Role>) => api.patch<Role>(`/roles/${id}`, role),
  delete: (id: number) => api.delete(`/roles/${id}`),
};

export const permissionsApi = {
  getAll: () => api.get<Permission[]>('/permissions'),
  getByRoleId: (roleId: number) => api.get<Permission[]>(`/permissions?roleId=${roleId}`),

  create: (permission: Permission) => api.post<Permission>('/permissions', permission),

  update: (id: number, permission: Partial<Permission>) =>
    api.patch<Permission>(`/permissions/${id}`, permission),
};


export const employeesApi = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: number) => api.get<Employee>(`/employees/${id}`),
  create: (employee: Omit<Employee, 'id'>) => api.post<Employee>('/employees', employee),
  update: (id: number, employee: Partial<Employee>) => api.patch<Employee>(`/employees/${id}`, employee),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (project: Omit<Project, 'id'>) => api.post<Project>('/projects', project),
  update: (id: number, project: Partial<Project>) => api.patch<Project>(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export default api;
