import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag, List, message } from 'antd';
import axios from 'axios';
import { Job, JobApplication, User } from '../types';

interface ApplicationWithUser extends JobApplication {
  user?: User;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const jobResponse = await axios.get(`http://localhost:3001/jobs/${id}`);
        setJob(jobResponse.data);

        const applicationsResponse = await axios.get(`http://localhost:3001/applications?jobId=${id}`);
        const applicationsWithUsers = await Promise.all(
          applicationsResponse.data.map(async (application: JobApplication) => {
            const userResponse = await axios.get(`http://localhost:3001/users/${application.userId}`);
            return { ...application, user: userResponse.data };
          })
        );
        setApplications(applicationsWithUsers);
      } catch (error) {
        message.error('Failed to fetch job details');
      }
      setLoading(false);
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  const jobTypeColor = {
    'Full-time': 'green',
    'Part-time': 'blue',
    'Remote': 'purple',
  };

  return (
    <Card title={job.title}>
      <p><strong>Company: </strong> {job.company}</p>
      <p><strong>Location: </strong> {job.location}</p>
      <p><strong>Salary: </strong> ${job.salary.toLocaleString()}/year</p>
      <p><strong>Type: </strong> <Tag color={jobTypeColor[job.type]}>{job.type}</Tag></p>
      <p><strong>Description: </strong> {job.description}</p>
     
      <p><strong>Created At: </strong> {new Date(job.createdAt).toLocaleDateString()}</p>

      <Card title="Applications" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={applications}
          renderItem={(application) => (
            <List.Item>
              <List.Item.Meta
                title={application.user?.name || 'User not found'}
                description={`Status: ${application.status.toUpperCase()}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </Card>
  );
};

export default JobDetail;