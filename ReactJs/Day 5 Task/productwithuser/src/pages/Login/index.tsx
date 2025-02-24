import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const { Title, Text } = Typography;

// Secret key for JWT (should be stored securely in a backend)
const SECRET_KEY = new TextEncoder().encode(
  "a9d0baf35b6eca8c6664af58722afa050f623bf11470e0dbba05d6786b194d4da5e56d68cee5bfd8f73736bce11be2938a5d8ea070824a362dcf51f04fbc4a6ebeeb6c0eb26317ef9d7e1b1bf8d4289c2d87666e8150bbb040d552c7fd3f791168855584b99c4f492ec2dbf19a0ecdd69afc34e0e5d38be0174c67c14c813f55"
);

// Generate JWT token
const generateToken = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Token expires in 1 hour
    .sign(SECRET_KEY);
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);

    // Fetch users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === values.email);

    if (!user) {
      message.error("User not found!");
      setLoading(false);
      return;
    }

    // Check password
    if (!bcrypt.compareSync(values.password, user.password)) {
      message.error("Incorrect password!");
      setLoading(false);
      return;
    }

    // Generate JWT token
    const jwtToken = await generateToken({ email: user.email, name: user.name });

    // Store token in local storage
    localStorage.setItem("authToken", jwtToken);

    message.success("Login successful! Redirecting...");
    setTimeout(() => {
      navigate("/products");
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <Title level={2} style={styles.title}>
          Welcome Back 👋
        </Title>
        <Text type="secondary" style={styles.subtitle}>
          Please enter your login details to continue.
        </Text>

        <Form layout="vertical" onFinish={onFinish} style={styles.form}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={styles.button}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </Text>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    padding: "20px",
  },
  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
  },
  title: {
    color: "#333",
    marginBottom: "10px",
  },
  subtitle: {
    display: "block",
    marginBottom: "20px",
  },
  form: {
    marginTop: "20px",
  },
  button: {
    fontWeight: "bold",
    borderRadius: "5px",
  },
  link: {
    color: "#1890ff",
    fontWeight: "bold",
  },
};

export default Login;
