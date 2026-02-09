import { authenticatedClient } from '@/features/auth/api/client';
import type { GroupTasksRequest, GroupTasksResult } from '../types/groupTask.types';
import type { GroupTasksCalendarParams, GroupTasksCalendarResponse } from '../types/groupTaskCalendar.types';

export const getGroupTasks = async (params: GroupTasksRequest): Promise<GroupTasksResult> => {
  const { data } = await authenticatedClient.get<GroupTasksResult>('/group-tasks', {
    params: {
      groupId: params.groupId,
      date: params.date,
    },
  });
  return data;
};

// 그룹 할일 캘린더 (할일 있는 날짜 목록)
export const getGroupTasksCalendar = async (
  params: GroupTasksCalendarParams
): Promise<GroupTasksCalendarResponse> => {
  const response = await authenticatedClient.get<GroupTasksCalendarResponse>(
    '/group-tasks/calendar',
    { params }
  );
  return response.data;
};
