import { authenticatedClient } from '@/features/auth/api/client';
import type { MyTaskRequest, MyTaskResponse, UpdateTaskStatusRequest } from '../types/task.types';

// 내 할일 조회
export const getMyTasks = async (params: MyTaskRequest): Promise<MyTaskResponse> => {
  const response = await authenticatedClient.get<MyTaskResponse>('/api/my-tasks', {
    params: {
      groupId: params.groupId,
      date: params.date,
    },
  });
  return response.data;
};

// 할일 상태 업데이트
export const updateTaskStatus = async (params: UpdateTaskStatusRequest): Promise<void> => {
  await authenticatedClient.put(
    `/api/my-tasks/${params.occurrenceId}/status`,
    {
      status: params.status,
      doneByMemberId: params.doneByMemberId,
      doneAt: params.doneAt,
      updatedAt: params.updatedAt,
    }
  );
};