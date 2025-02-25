import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some((user: any) => user.email === values.email)) {
      message.error("User already exists!");
      setLoading(false);
      return;
    }

    const hashedPassword = bcrypt.hashSync(values.password, 10);
    const newUser = { name: values.name, email: values.email, password: hashedPassword };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    message.success("Registration successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} >
        <Title level={2} style={styles.title}>Create an Account</Title>
        <Text type="secondary" style={styles.subtitle}>Join us today!</Text>

        <Form layout="vertical" onFinish={onFinish} style={styles.form}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name!" }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid email!" }]}>
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter password!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block style={styles.button}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
  button: {
    fontWeight: "bold",
    borderRadius: "5px",
  },
  link: {
    color: "#1890ff",
    fontWeight: "bold",
  },
};

export default Register;
