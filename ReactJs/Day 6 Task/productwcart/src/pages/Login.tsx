import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title } = Typography;

const Login: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <Title level={2} className="text-center">Login</Title>
        <Form layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
