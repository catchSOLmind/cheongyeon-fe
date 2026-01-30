import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DefaultLayout } from '../layouts/DefaultLayout';
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
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'mypage', element: <MyPage /> },
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
  // 할 일 관련 페이지
  {
    path: '/calendar/task',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <AddTodoPage /> },
    ],
  },
  {
    path: '/calendar/feedback',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <FeedbackPage /> },
    ],
  },
  //디자인 완로 후 수정 !!!!!
  {
    path: '/calendar/edit',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <FeedbackPage /> },
    ],
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);