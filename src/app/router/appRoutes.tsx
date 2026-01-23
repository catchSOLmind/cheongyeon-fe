import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import LoginPage from '../../features/auth/pages/LoginPage';

export const appRouter = createBrowserRouter([
  {
    path: '/',              
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> }, 
      { path: 'login', element: <LoginPage /> },               
      { path: '*', element: <Navigate to="login" replace /> },  
    ],
  },
]);
