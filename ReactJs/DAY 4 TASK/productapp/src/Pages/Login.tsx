import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    setLoading(true);

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Find user
    const user = users.find((u: any) => u.email === values.email);

    if (!user) {
      message.error("User not found!");
      setLoading(false);
      return;
    }

    // Compare passwords
    if (!bcrypt.compareSync(values.password, user.password)) {
      message.error("Incorrect password!");
      setLoading(false);
      return;
    }

    // Store user session
    const token = Math.random().toString(36).substring(2); // Fake JWT
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));

    message.success("Login successful! Redirecting...");
    setTimeout(() => {
      navigate("/dashboard/products");
    }, 1500);
  };

  return (
    <Card title="Login" style={{ width: 400, margin: "100px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
        <p style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Form>
    </Card>
  );
};

export default Login;
