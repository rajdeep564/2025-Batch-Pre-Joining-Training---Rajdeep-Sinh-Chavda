import React, { createContext, useState, useEffect, useContext } from "react";
import { User, AuthContextType, UserPermissions } from "../types";
import { usersApi, permissionsApi } from "../api/api";
import { comparePassword, generateToken, verifyToken } from "../utils/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = await verifyToken(token);
          if (payload.userId && payload.roleId) {
            const { data } = await usersApi.getById(Number(payload.userId));
            setUser(data);
            await loadPermissions(Number(payload.roleId));
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem("token");
          setUser(null);
          window.location.href = "/login"; 
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadPermissions = async (roleId: number) => {
    try {
      const { data } = await permissionsApi.getByRoleId(roleId);
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
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await usersApi.getByEmail(email);

      if (data.length === 0) {
        throw new Error("User not found");
      }

      const user = data[0];
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = await generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      });

      localStorage.setItem("token", token);
      setUser(user);
      await loadPermissions(user.roleId);

      window.location.href = "/dashboard"; 
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPermissions({});
    window.location.href = "/login"; 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
