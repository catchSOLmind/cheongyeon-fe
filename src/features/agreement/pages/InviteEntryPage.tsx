// src/features/agreement/pages/InviteEntryPage.tsx
// 링크 공유로 진입시의 중간 지점 
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function InviteEntryPage() {
  const { invitationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!invitationId) {
      navigate('/', { replace: true });
      return;
    }

    // 로그인 완료 후 처리할 초대 id 저장
    sessionStorage.setItem('pendingInvitationId', invitationId);

    // 로그인 후 돌아올 목적지도 저장 (선택)
    sessionStorage.setItem('postLoginAction', 'ACCEPT_INVITE');

    // 로그인 페이지로 이동
    navigate('/login', { replace: true });
  }, [invitationId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      로그인으로 이동 중...
    </div>
  );
}
