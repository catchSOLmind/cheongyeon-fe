
import { authenticatedClient } from '@/features/auth/api/client';
import type { GetGroupDashboardResponse, GroupDashboardResult } from '@/features/calendar/types/dashboard.types';

export const getGroupDashboard = async (
  groupId: number
): Promise<GroupDashboardResult> => {
  const res = await authenticatedClient.get<GetGroupDashboardResponse>(
    `/groups/${groupId}/dashboard`
  );

  return res.data; 
};
