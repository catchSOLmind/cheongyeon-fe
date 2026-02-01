import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { ProtectedRoute } from '../router/ProtectedRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import KakaoCallbackPage from '@/features/auth/pages/KakaoCallbackPage';
import HomePage from '@/features/home/homePages'
import CalendarPage from '@/features/calendar/pages/CalendarPage';
import MyPage from '@/features/calendar/pages/MyPage';
import InvitePage from '@/features/invite/pages/InvitePage';
import AddTodoPage from '@/features/todo/pages/addTodoPage';
import FeedbackPage from '@/features/todo/pages/feedbackPage';

export const appRouter = createBrowserRouter([
  // 로그인 
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
  // 카카오 로그인 콜백
  {
    path: '/auth/kakao/callback',
    element: <KakaoCallbackPage />,
  },
  // 메인 앱 
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
  //하단바 없는 페이지
  {
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/invite/:houseId', element: <InvitePage /> },
      { path: '/calendar/task', element: <AddTodoPage /> },
      { path: '/calendar/feedback', element: <FeedbackPage /> },
      { path: '/calendar/edit', element: <FeedbackPage /> }, // 디자인 완료 후 수정
    ],
  },
  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);