import { authenticatedClient } from '@/features/auth/api/client';
import type { GroupTasksRequest, GroupTasksResult } from '../types/groupTask.types';

export const getGroupTasks = async (params: GroupTasksRequest): Promise<GroupTasksResult> => {
  const { data } = await authenticatedClient.get<GroupTasksResult>('/group-tasks', {
    params: {
      groupId: params.groupId,
      date: params.date,
    },
  });
  return data;
};
