import { authenticatedClient } from '@/features/auth/api/client';
import type { GetGroupMembersResponse } from './groupMembers.types';

export const getGroupMembers = async (
  groupId: number
): Promise<GetGroupMembersResponse> => {
  const response =
    await authenticatedClient.get<GetGroupMembersResponse>(
      `/groups/${groupId}/members`
    );

  return response.data;
};
