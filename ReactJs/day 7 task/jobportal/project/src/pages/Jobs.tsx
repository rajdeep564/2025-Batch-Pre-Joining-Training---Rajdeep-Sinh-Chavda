import React, { useEffect, useState } from 'react';
import { Card, Input, Select, Button, List, Tag, Space, message, Modal, Form, InputNumber, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Job } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const { Search } = Input;
const { Option } = Select;

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/jobs');
      setJobs(response.data);
    } catch (error) {
      message.error('Failed to fetch jobs');
    }
    setLoading(false);
  };

  const handleApply = async (jobId: string) => {
    try {
      const existingApplicationResponse = await axios.get(
        `http://localhost:3001/applications?jobId=${jobId}&userId=${user?.id}`
      );
      if (existingApplicationResponse.data.length > 0) {
        message.error('You have already applied for this job.');
        return;
      }

      await axios.post('http://localhost:3001/applications', {
        jobId,
        userId: user?.id,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      });
      message.success('Application submitted successfully!');
    } catch (error) {
      message.error('Failed to submit application');
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:3001/jobs/${jobId}`);
      message.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      message.error('Failed to delete job');
    }
  };

  const showDeleteConfirm = (jobId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this job?',
      onOk: () => handleDelete(jobId),
    });
  };

  const showUpdateModal = (job: Job) => {
    setCurrentJob(job);
    setIsModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!currentJob) return;

    try {
      await axios.patch(`http://localhost:3001/jobs/${currentJob.id}`, values);
      message.success('Job updated successfully');
      fetchJobs();
      setIsModalOpen(false);
    } catch (error) {
      message.error('Failed to update job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  const jobTypeColor = {
    'Full-time': 'green',
    'Part-time': 'blue',
    'Remote': 'purple',
  };

  return (
    <div>
      <Card title="Job Listings">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Search
              placeholder="Search jobs..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Job Type"
              style={{ width: 200 }}
              onChange={setSelectedType}
              allowClear
            >
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Remote">Remote</Option>
            </Select>
          </Space>

          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={filteredJobs}
            renderItem={(job) => (
              <List.Item
                actions={[
                  <Button type="primary" onClick={() => handleApply(job.id)}>
                    Apply Now
                  </Button>,
                  user?.role === 'admin' && (
                    <>
                      <Button type="default" onClick={() => showUpdateModal(job)}>
                        Update
                      </Button>
                      <Button type="danger" style={{ color: 'red' }} onClick={() => showDeleteConfirm(job.id)}>
                        Delete
                      </Button>
                    </>
                  ),
                  <Link to={`/jobs/${job.id}`}>
                    <Button type="link">View Details</Button>
                  </Link>
                ]}
              >
                <List.Item.Meta
                  title={job.title}
                  description={
                    <Space>
                      <Tooltip title="Job Type">
                        <Tag color={jobTypeColor[job.type as keyof typeof jobTypeColor]}>
                          {job.type}
                        </Tag>
                      </Tooltip>
                      <Tooltip title="Location">
                        <Tag color="blue">{job.location}</Tag>
                      </Tooltip>
                      <Tooltip title="Salary">
                        <Tag color="gold">${job.salary.toLocaleString()}/year</Tag>
                      </Tooltip>
                      <Tooltip title="Company">
                        <Tag color="cyan">{job.company}</Tag>
                      </Tooltip>
                    </Space>
                  }
                />
                <div>{job.description}</div>
              </List.Item>
            )}
          />
        </Space>
      </Card>

      <Modal
        title="Update Job"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          initialValues={currentJob || {}}
          onFinish={handleUpdate}
          layout="vertical"
        >
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
              Update Job
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Jobs;