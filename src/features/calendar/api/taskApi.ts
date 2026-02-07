import { authenticatedClient } from '@/features/auth/api/client';
import type { MyTaskRequest, MyTaskResponse , MyTaskCompleteReponse ,UpdateMyTaskStatusRequest, UpdateMyTaskStatusResponse, } from '../types/task.types';


// "내 할일" 과 관련된 task 타입 


// 내 할일 조회
export const getMyTasks = async (params: MyTaskRequest): Promise<MyTaskResponse> => {
  const response = await authenticatedClient.get<MyTaskResponse>('/my-tasks', {
    params: {
      date: params.date,
    },
  });
  return response.data;
};

// 내 할일 완료하기 ( only 완료만 )
export const CompleteMyTasks = async(
  occurrenceId: number 
) : Promise<MyTaskCompleteReponse> => {
  const response = await authenticatedClient.post<MyTaskCompleteReponse>(`/my-tasks/${occurrenceId}/complete`);
    return response.data
};

// 내 할일 상태 변경하기
export const updateMyTaskStatus = async (
  occurrenceId: number,
  body: UpdateMyTaskStatusRequest
): Promise<UpdateMyTaskStatusResponse> => {
  const res = await authenticatedClient.patch<UpdateMyTaskStatusResponse>(
    `/my-tasks/${occurrenceId}/status`,
    body
  );
  return res.data;
};