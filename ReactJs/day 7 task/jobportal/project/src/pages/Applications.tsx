import React, { useEffect, useState } from 'react';
import { Card, List, Tag, message, Button, Tabs } from 'antd';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Job, JobApplication, User } from '../types';
import { fetchApplications } from '../store/slices/applicationsSlice';

interface ApplicationWithJobAndUser extends JobApplication {
  job?: Job;
  user?: User;
}

const Applications: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: applications, loading } = useSelector((state: RootState) => state.applications);
  const [applicationsWithJobs, setApplicationsWithJobs] = useState<ApplicationWithJobAndUser[]>([]);
  const [removedApplications, setRemovedApplications] = useState<ApplicationWithJobAndUser[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchApplications(user.role === 'admin' ? null : user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchJobsAndUsersForApplications = async () => {
      try {
        const applicationsWithJobsAndUsers = await Promise.all(
          applications.map(async (application) => {
            try {
              const jobResponse = await axios.get(`http://localhost:3001/jobs/${application.jobId}`);
              const userResponse = await axios.get(`http://localhost:3001/users/${application.userId}`);
              return { ...application, job: jobResponse.data, user: userResponse.data };
            } catch (error) {
              console.error(`Failed to fetch details for applicationId: ${application.id}`);
              return { ...application, job: null, user: null };
            }
          })
        );
        setApplicationsWithJobs(applicationsWithJobsAndUsers);
      } catch (error) {
        message.error('Failed to fetch job and user details');
      }
    };

    if (applications.length > 0) {
      fetchJobsAndUsersForApplications();
    }
  }, [applications]);

  useEffect(() => {
    const fetchRemovedApplications = async () => {
      try {
        const response = await axios.get('http://localhost:3001/removedApplications');
        setRemovedApplications(response.data);
      } catch (error) {
        message.error('Failed to fetch removed applications');
      }
    };

    fetchRemovedApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      await axios.patch(`http://localhost:3001/applications/${applicationId}`, {
        status,
      });
      message.success(`Application ${status}`);
      dispatch(fetchApplications(user.role === 'admin' ? null : user.id));
    } catch (error) {
      message.error('Failed to update application status');
    }
  };

  const handleRemove = async (applicationId: string) => {
    try {
      const applicationToRemove = applicationsWithJobs.find(app => app.id === applicationId);
      if (!applicationToRemove) return;

      // Optimistically update the state
      setApplicationsWithJobs((prev) => prev.filter((app) => app.id !== applicationId));
      setRemovedApplications((prev) => [...prev, applicationToRemove]);

      await axios.delete(`http://localhost:3001/applications/${applicationId}`);
      await axios.post('http://localhost:3001/removedApplications', applicationToRemove);
      message.success('Application removed successfully');
      dispatch(fetchApplications(user.role === 'admin' ? null : user.id));
    } catch (error) {
      message.error('Failed to remove application');
      // Revert the state update if the removal fails
      dispatch(fetchApplications(user.role === 'admin' ? null : user.id));
    }
  };

  const renderApplicationItem = (application: ApplicationWithJobAndUser, isRemoved: boolean) => (
    <List.Item
      actions={
        !isRemoved && user.role === 'admin'
          ? [
              <Button
                type="primary"
                onClick={() => handleStatusChange(application.id, 'accepted')}
              >
                Accept
              </Button>,
              <Button
                type="danger"
                onClick={() => handleStatusChange(application.id, 'rejected')}
              >
                Reject
              </Button>,
              <Button
                type="default"
                onClick={() => handleRemove(application.id)}
              >
                Remove
              </Button>,
            ]
          : []
      }
    >
      <List.Item.Meta
        title={application.job?.title || 'Job Title Not Available'}
        description={
          <div>
            <Tag color={getStatusColor(application.status)}>
              {application.status.toUpperCase()}
            </Tag>
            <div style={{ marginTop: 8 }}>
              <strong>Company:</strong> {application.job?.company || 'Company Not Available'}
            </div>
            <div>
              <strong>Applied:</strong>{' '}
              {new Date(application.appliedAt).toLocaleDateString()}
            </div>
            <div>
              <strong>User:</strong> {application.user?.name || 'User Not Available'}
            </div>
          </div>
        }
      />
      <div>{application.job?.description || 'Job Description Not Available'}</div>
    </List.Item>
  );

  return (
    <Card title="Applications">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Active Applications" key="1">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={applicationsWithJobs}
            renderItem={(application) => renderApplicationItem(application, false)}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Removed Applications" key="2">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={removedApplications}
            renderItem={(application) => renderApplicationItem(application, true)}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Applications;