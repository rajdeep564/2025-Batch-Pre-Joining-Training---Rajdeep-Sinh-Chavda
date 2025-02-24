import React, { createContext, useContext, useState, useEffect } from "react";
import { SignJWT, jwtVerify } from "jose";
import { useNavigate, NavigateFunction } from "react-router-dom";

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

// Secret key for JWT encoding (should be stored securely in a backend)
const SECRET_KEY = new TextEncoder().encode("a9d0baf35b6eca8c6664af58722afa050f623bf11470e0dbba05d6786b194d4da5e56d68cee5bfd8f73736bce11be2938a5d8ea070824a362dcf51f04fbc4a6ebeeb6c0eb26317ef9d7e1b1bf8d4289c2d87666e8150bbb040d552c7fd3f791168855584b99c4f492ec2dbf19a0ecdd69afc34e0e5d38be0174c67c14c813f55");

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

// Wrapper component that includes navigation logic
const AuthProviderWithNavigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProviderContent navigate={navigate}>{children}</AuthProviderContent>;
};

// Main AuthProvider content component
const AuthProviderContent: React.FC<{ 
  children: React.ReactNode;
  navigate: NavigateFunction;
}> = ({ children, navigate }) => {
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
    navigate("/"); // Redirect to home after login
  };

  // Logout function (clear storage)
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the wrapper component as AuthProvider
export const AuthProvider = AuthProviderWithNavigation;

// Custom Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};