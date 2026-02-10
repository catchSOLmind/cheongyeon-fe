import { authenticatedClient } from '@/features/auth/api/client';
import type { MyTaskRequest, MyTaskResponse , MyTaskCompleteReponse } from '../types/task.types';
import type {   MyTasksCalendarParams , MyTasksCalendarResponse } from '../types/myTaskCalendar.types';


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
export const completeMyTasks = async(
  occurrenceId: number 
) : Promise<MyTaskCompleteReponse> => {
  const response = await authenticatedClient.post<MyTaskCompleteReponse>(`/my-tasks/${occurrenceId}/complete`);
    return response.data
};

// 내 할일 캘린더 (할일 있는 날짜 목록)
export const getMyTasksCalendar = async (
  params: MyTasksCalendarParams
): Promise<MyTasksCalendarResponse> => {
  const response = await authenticatedClient.get<MyTasksCalendarResponse>(
    '/my-tasks/calendar',
    { params }
  );
  return response.data;
};