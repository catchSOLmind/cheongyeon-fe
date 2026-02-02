import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { ProtectedRoute } from '../router/ProtectedRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import KakaoCallbackPage from '@/features/auth/pages/KakaoCallbackPage';
import HomePage01 from '@/features/home/homePage01';
import HomePage02 from '@/features/home/homePage02';
import HomePage03 from '@/features/home/homePage03';
import HomePage04 from '@/features/home/homePage04';
import MyPage from '@/features/calendar/pages/MyPage';
import CalendarPage from '@/features/calendar/pages/CalendarPage';
import InvitePage from '@/features/invite/pages/InvitePage';
import AddTodoPage from '@/features/todo/pages/addTodoPage';
import FeedbackPage from '@/features/todo/pages/feedbackPage';
import FeedbackFinishPage from '@/features/todo/pages/feedbackFinPage';

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
      { index: true, element: <HomePage01 /> },
      { path: 'home02', element: <HomePage02 /> },
      { path: 'home03', element: <HomePage03 /> },
      { path: 'home04', element: <HomePage04 /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'calendar', element: <CalendarPage /> },
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
      { path: '/calendar/feedback-finish', element: <FeedbackFinishPage /> },
      { path: '/calendar/edit', element: <FeedbackPage /> }, // 디자인 완료 후 수정
    ],
  },
  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);