import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title } = Typography;

const Register: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <Title level={2} className="text-center">Register</Title>
        <Form layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name!" }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter a password!" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block>Register</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
