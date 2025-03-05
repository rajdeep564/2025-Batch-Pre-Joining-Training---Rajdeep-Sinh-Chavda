import React, { createContext, useContext, useState, useEffect } from "react";
import { PermissionContextType, UserPermissions } from "../types";
import { permissionsApi } from "../api/api";
import { useAuth } from "./AuthContext";

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, permissions: authPermissions } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>(authPermissions);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true); // ✅ Track permission loading

  useEffect(() => {
    if (!user) {
      setPermissions({});
      setIsPermissionsLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      setIsPermissionsLoading(true);
      try {
        const { data } = await permissionsApi.getByRoleId(user.roleId);
        const formattedPermissions: UserPermissions = {};

        data.forEach((permission) => {
          formattedPermissions[permission.module] = {
            view: permission.view,
            add: permission.add,
            edit: permission.edit,
            delete: permission.delete,
          };
        });

        setPermissions(formattedPermissions);
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        setIsPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (module: string, action: "view" | "add" | "edit" | "delete"): boolean => {
    if (!user) return false;
    return permissions[module]?.[action] || false;
  };

  const refreshPermissions = async () => {
    if (!user) return;
    setIsPermissionsLoading(true);
    try {
      const { data } = await permissionsApi.getByRoleId(user.roleId);
      const formattedPermissions: UserPermissions = {};

      data.forEach((permission) => {
        formattedPermissions[permission.module] = {
          view: permission.view,
          add: permission.add,
          edit: permission.edit,
          delete: permission.delete,
        };
      });

      setPermissions(formattedPermissions);
    } catch (error) {
      console.error("Error refreshing permissions:", error);
    } finally {
      setIsPermissionsLoading(false);
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission,
        isPermissionsLoading, // ✅ Expose loading state
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
