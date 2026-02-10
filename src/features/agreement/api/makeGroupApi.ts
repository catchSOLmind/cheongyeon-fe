import { authenticatedClient } from '@/features/auth/api/client';

interface InvitationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    invitationId: number;
    inviteUrl: string;
  };
}

export const createInvitationLink = async (): Promise<string> => {
  const { data } = await authenticatedClient.post<InvitationResponse>(
    '/groups/invitations',
    {}
  );

  if (!data.isSuccess) {
    throw new Error(data.message || '초대 링크 생성 실패');
  }

  return data.result.inviteUrl;
};
