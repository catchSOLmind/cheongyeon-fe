import { authenticatedClient } from '@/features/auth/api/client';
import type { MyTaskRequest, MyTaskResponse, UpdateTaskStatusRequest } from '../types/task.types';

// 내 할일 조회
export const getMyTasks = async (params: MyTaskRequest): Promise<MyTaskResponse> => {
  const response = await authenticatedClient.get<MyTaskResponse>('/my-tasks', {
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
    `/my-tasks/${params.occurrenceId}/status`,
    {
      status: params.status,
      doneByMemberId: params.doneByMemberId,
      doneAt: params.doneAt,
      updatedAt: params.updatedAt,
    }
  );
};

// 내 할일 추가는 할일 추가 페이지에서 처리