import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (!user) return;

    setLoading(true);
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, values);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <Card title="Edit Profile">
      <Form
        name="profile"
        initialValues={user || {}}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Profile;