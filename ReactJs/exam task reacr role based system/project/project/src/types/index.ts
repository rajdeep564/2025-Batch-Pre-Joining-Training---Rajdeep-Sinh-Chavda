export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  roleId: number;
  module: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  manager: string;
}

export interface UserPermissions {
  [module: string]: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  permissions: UserPermissions;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PermissionContextType {
  permissions: UserPermissions;
  hasPermission: (module: string, action: "view" | "add" | "edit" | "delete") => boolean;
  refreshPermissions: () => Promise<void>;
  isPermissionsLoading: boolean; // Add this line
}