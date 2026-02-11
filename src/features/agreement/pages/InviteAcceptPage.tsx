import { authenticatedClient } from "@/features/auth/api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InviteAcceptPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const idStr = sessionStorage.getItem('pendingInvitationId');
        if (!idStr) throw new Error('초대 정보가 없어요. 초대 링크로 다시 들어와주세요.');

        const invitationId = Number(idStr);
        const { data } = await authenticatedClient.post(
          `/groups/invitations/${invitationId}/accept`
        );

        sessionStorage.removeItem('pendingInvitationId');
        sessionStorage.removeItem('postLoginAction');

        // accept 응답에 agreementId가 있으면 /agreement/3으로
        // 없으면 /agreement/member로
        const agreementId = data?.result?.agreementId;

        if (agreementId) {
          navigate('/agreement/3', { replace: true, state: { agreementId } });
        } else {
          navigate('/agreement/member', { replace: true });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '초대 수락 실패');
      }
    };

    run();
  }, [navigate]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">{error}</div>
  );
  return (
    <div className="min-h-screen flex items-center justify-center">초대 수락 중...</div>
  );
}