import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DefaultLayout } from '../layouts/DefaultLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import HomePage from '@/features/home/homePages'
import CalendarPage from '@/features/calendar/pages/CalendarPage';
import InvitePage from '@/features/invite/pages/InvitePage';

export const appRouter = createBrowserRouter([
// 로그인
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
// 메인 앱 
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
    ],
  },
  // 하단바 없는 페이지
  {
    path: '/invite',
    element: <DefaultLayout />,
    children: [
      { path: ':houseId', element: <InvitePage /> },
    ],
  },
  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);