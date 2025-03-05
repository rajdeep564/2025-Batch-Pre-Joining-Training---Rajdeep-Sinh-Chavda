import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Result
        icon={<SafetyOutlined style={{ color: '#ff4d4f' }} />}
        status="403"
        title="Access Denied"
        subTitle="You don't have permission to access this page."
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
