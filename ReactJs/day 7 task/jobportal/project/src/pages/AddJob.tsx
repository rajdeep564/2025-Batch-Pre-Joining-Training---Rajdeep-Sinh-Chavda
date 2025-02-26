import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select, InputNumber } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/jobs', {
        ...values,
        createdAt: new Date().toISOString(),
      });
      message.success('Job added successfully!');
      navigate('/jobs');
    } catch (error) {
      message.error('Failed to add job');
    }
    setLoading(false);
  };

  return (
    <Card title="Add Job">
      <Form name="add-job" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input the job title!' }]}
        >
          <Input placeholder="Job Title" />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Please input the job description!' }]}
        >
          <Input.TextArea placeholder="Job Description" />
        </Form.Item>
        <Form.Item
          name="salary"
          rules={[
            { required: true, message: 'Please input the job salary!' },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || isNaN(value)) {
                  return Promise.reject('Please enter a valid number!');
                }
                if (value <= 0) {
                  return Promise.reject('Salary must be greater than 0!');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Job Salary"
            min={1} // Ensures UI restricts negative values
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="location"
          rules={[{ required: true, message: 'Please input the job location!' }]}
        >
          <Input placeholder="Job Location" />
        </Form.Item>
        <Form.Item
          name="type"
          rules={[{ required: true, message: 'Please select the job type!' }]}
        >
          <Select placeholder="Job Type">
            <Option value="Full-time">Full-time</Option>
            <Option value="Part-time">Part-time</Option>
            <Option value="Remote">Remote</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="company"
          rules={[{ required: true, message: 'Please input the company name!' }]}
        >
          <Input placeholder="Company Name" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Job
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddJob;