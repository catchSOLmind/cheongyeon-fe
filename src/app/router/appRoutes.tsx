import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/homePages'
import CalendarPage from '@/features/calendar/pages/CalendarPage';

export const appRouter = createBrowserRouter([
  // 메인 앱 (로그인 후)
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
    ],
  },
  // 인증 페이지 (로그인 전)
  {
    path: '/login',
    element: <LoginPage />,
  },
  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);