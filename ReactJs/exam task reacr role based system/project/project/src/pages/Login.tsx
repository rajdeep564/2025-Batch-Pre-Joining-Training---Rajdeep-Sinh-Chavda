import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Alert, Spin, message } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(values.email, values.password);
      message.success("Login successful! Redirecting to dashboard..."); // ✅ Success message
      setTimeout(() => navigate("/dashboard"), 1000); // ✅ Redirect after delay
    } catch (err) {
      setError("Invalid email or password");
      message.error("Login failed. Please check your credentials."); // ✅ Error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-4">
          <SafetyOutlined className="text-3xl text-purple-600" />
          <h2 className="text-xl font-bold">RBAC System</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email address" }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isLoading}>
              {isLoading ? <Spin size="small" /> : "Sign In"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
