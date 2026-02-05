// task 추가 

import { authenticatedClient } from '@/features/auth/api/client';
import type { AddTasksResponse, AddTasksRequest } from '../types/myTask.types';

export const addMyTasks = async (
  request: AddTasksRequest
): Promise<AddTasksResponse> => {
  const response = await authenticatedClient.post<AddTasksResponse>(
    '/my-tasks',
    request
  );
  return response.data;
}