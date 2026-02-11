import { authenticatedClient } from '@/features/auth/api/client';
import type { AcceptInvitationResponse } from '../types/invite.types';

interface InvitationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    invitationId: number;
    inviteUrl: string;
  };
}

// 초대링크 생성 
export const createInvitation = async (): Promise<{ invitationId: number; inviteUrl: string }> => {
  const { data } = await authenticatedClient.post<InvitationResponse>(
    '/groups/invitations',
    {}
  );

  if (!data.isSuccess) {
    throw new Error(data.message || '초대 링크 생성 실패');
  }

  return data.result; // invitationId + inviteUrl 둘 다 반환
};

/**
 * 초대 수락 (그룹 가입)
 * POST /api/groups/invitations/{invitationId}/accept
 */
export const acceptGroupInvitation = async (
  invitationId: number
): Promise<AcceptInvitationResponse> => {
  const { data } = await authenticatedClient.post<AcceptInvitationResponse>(
    `/groups/invitations/${invitationId}/accept`
  );
  return data;
};
