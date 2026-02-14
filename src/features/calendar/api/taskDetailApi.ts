import { authenticatedClient } from '@/features/auth/api/client';
import type { MyTaskDetailResponse } from '@/features/calendar/types/taskDetail.types';

// 할일 상세를 조회한다 ( 그룹도 공통으로 조회 )
export const getMyTaskDetail = async (
  occurrenceId: number
): Promise<MyTaskDetailResponse> => {
  const response = await authenticatedClient.get<MyTaskDetailResponse>(
    `/my-tasks/${occurrenceId}`
  );
  return response.data;
};
