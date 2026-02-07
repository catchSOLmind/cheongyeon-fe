import { authenticatedClient } from '@/features/auth/api/client';
import axios from 'axios';

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
  try {
    const response = await authenticatedClient.post<InvitationResponse>(
      '/groups/invitations',
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const { data } = response;

    if (!data.isSuccess) {
      throw new Error(data.message || '초대 링크 생성 실패');
    }

    return data.result.inviteUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '초대 링크 생성 실패');
    }
    throw error;
  }
};