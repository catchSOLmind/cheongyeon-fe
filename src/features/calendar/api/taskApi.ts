import { authenticatedClient } from '@/features/auth/api/client';
import type { MyTaskRequest, MyTaskResponse } from '../types/task.types';

// 내 할일 조회
export const getMyTasks = async (params: MyTaskRequest): Promise<MyTaskResponse> => {
  const response = await authenticatedClient.get<MyTaskResponse>('/my-tasks', {
    params: {
      date: params.date,
    },
  });
  return response.data;
};

// 내 할일 추가는 할일 추가 페이지에서 처리