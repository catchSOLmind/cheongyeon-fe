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
// import InvitePage from '@/features/invite/pages/InvitePage';
import AddTodoPage from '@/features/todo/pages/addTodoPage';
import FeedbackPage from '@/features/todo/pages/feedbackPage';
import FeedbackFinishPage from '@/features/todo/pages/feedbackFinPage';
import TestPage from '@/features/test/pages/TestQuestionPage';
import TestResultPage from '@/features/test/pages/TestResultPage';
import TestStartPage from '@/features/test/pages/TestStartPage';
import AgreementPage01 from '@/features/agreement/pages/AgreementPage01';
import AgreementPage03 from '@/features/agreement/pages/AgreementPage03';
import AgreementMemberPage from '@/features/agreement/pages/AggreementMemberPage';
import ChoiceReasonPage from '@/features/calendar/pages/ChoiceReasonPage';
import EraserPage from '@/features/eraser/pages/EraserPage';
import EraserApplyPage from '@/features/eraser/pages/EraserApplyPage';
import EraserDatePage from '@/features/eraser/pages/EraserDatePage';
import EraserConfirmPage from '@/features/eraser/pages/EraserConfirmPage';
import InviteEntryPage from '@/features/agreement/pages/InviteEntryPage';
import InviteAcceptPage from '@/features/agreement/pages/InviteAcceptPage';
import AgreementPage02 from '@/features/agreement/pages/AgreementPage02';
import AgreementResultPage from '@/features/agreement/pages/AgreementResultPasge';
import AgreementMainPage from '@/features/agreement/pages/AgreementMainPage';


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
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'home01', element: <HomePage01 /> },
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
      // { path: '/invite/:houseId', element: <InvitePage /> }, // 미사용 페이지 
      { path: '/calendar/task', element: <AddTodoPage /> },
      { path: '/calendar/feedback', element: <FeedbackPage /> },
      { path: '/calendar/feedback-finish', element: <FeedbackFinishPage /> },
      { path: '/calendar/edit', element: <FeedbackPage /> }, // 디자인 완료 후 수정
      { path: '/agreement', element: <AgreementPage01/>},
      { path: '/agreement/2',element:<AgreementPage02/>},
      { path: '/agreement/3',element:<AgreementPage03/>},
      { path: '/agreement/member',element:<AgreementMemberPage/>},
      { path:'/agreement/result', element:<AgreementResultPage/>},
      {path: '/agreement/main', element:<AgreementMainPage/>},
      { path: '/calendar/reason', element: <ChoiceReasonPage/>},
      { path: '/eraser/result', element:<EraserPage/> },
      { path: '/eraser/apply', element:<EraserApplyPage/> },
      { path : '/eraser/date', element:<EraserDatePage/>},
      { path : '/eraser/confirm', element:<EraserConfirmPage/>}
    ],},
    {
      // 로그인  여부와 상관없이 테스트 페이지 접근 가능 
      element: (
      <DefaultLayout />
      ),
      children: [
        { path: '/test-start', element: <TestStartPage /> },
        { path: '/test', element: <TestPage /> },
        { path: '/test-result', element: <TestResultPage /> },
        { path: '/invite/:invitationId', element: <InviteEntryPage /> },
        { path: '/invite/accept', element: <InviteAcceptPage /> },

      ],
    },
  // 404
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);