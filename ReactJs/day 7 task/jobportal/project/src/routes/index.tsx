import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Jobs from '../pages/Jobs';
import Applications from '../pages/Applications';
import Profile from '../pages/Profile';
import AddJob from '../pages/AddJob';
import JobDetail from '../pages/JobDetail';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/jobs" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <MainLayout />,
        children: [
          {
            path: 'jobs',
            element: <Jobs />,
          },
          {
            path: 'jobs/:id',
            element: <JobDetail />,
          },
          {
            path: 'applications',
            element: <Applications />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    element: <AdminRoute />,
    children: [
      {
        path: '',
        element: <MainLayout />,
        children: [
          {
            path: 'add-job',
            element: <AddJob />,
          },
          {
            path: 'manage-applications',
            element: <Applications />, // You can create a separate component for managing applications if needed
          },
        ],
      },
    ],
  },
]);