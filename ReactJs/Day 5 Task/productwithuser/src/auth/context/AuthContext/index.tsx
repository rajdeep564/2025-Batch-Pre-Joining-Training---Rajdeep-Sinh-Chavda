import React, { createContext, useContext, useState, useEffect } from "react";
import { SignJWT, jwtVerify } from "jose";

// Define user type
interface User {
  email: string;
  name: string;
}

// Define authentication context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Secret key for JWT encoding (should be stored securely)
const SECRET_KEY = new TextEncoder().encode("your-secure-secret-key");

// Generate JWT token
const generateToken = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Token expires in 1 hour
    .sign(SECRET_KEY);
};

// Verify JWT token
const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for an existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("authToken");

    if (storedUser && token) {
      verifyToken(token).then((decoded) => {
        if (decoded) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          logout();
        }
      });
    }
  }, []);

  // Login function (store user in localStorage)
  const login = async (userData: User) => {
    const jwtToken = await generateToken(userData);
    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("currentUser", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function (clear storage)
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
