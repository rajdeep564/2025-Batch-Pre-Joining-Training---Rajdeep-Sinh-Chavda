import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ConfigProvider, App as AntApp } from 'antd';
import { router } from './routes';
import { store } from './store';
import { loginWithToken } from './store/slices/authSlice';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loginWithToken(token));
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
          },
        }}
      >
        <AntApp>
          <AppContent />
        </AntApp>
      </ConfigProvider>
    </Provider>
  );
};

export default App;