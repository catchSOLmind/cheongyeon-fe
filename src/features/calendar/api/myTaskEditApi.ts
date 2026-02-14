import { authenticatedClient } from "@/features/auth/api/client";
import type { DeleteMyTaskResponse, PostponeMyTaskRequest, PostponeMyTaskResponse, UpdateMyTaskStatusRequest, UpdateMyTaskStatusResponse, UpdateTaskAssigneeRequest, UpdateTaskAssigneeResult } from "../types/myTaskEdit.types";

// 내 할일을 수정하는 API 

// 내 할일 상태 변경하기
export const updateMyTaskStatus = async (
  occurrenceId: number,
  body: UpdateMyTaskStatusRequest
): Promise<UpdateMyTaskStatusResponse> => {
  const response = await authenticatedClient.patch<UpdateMyTaskStatusResponse>(
    `/my-tasks/${occurrenceId}/status`,
    body
  );
  return response.data;
};

// 내 할일 삭제하기
export const deleteMyTask = async (
  occurrenceId: number
): Promise<DeleteMyTaskResponse> => {
  const response = await authenticatedClient.delete<DeleteMyTaskResponse>(
    `/my-tasks/${occurrenceId}`
  );
  return response.data;
};

// 내 할일 일정 변경하기 ( 미루기 )
export const postponeMyTask = async (
  occurrenceId: number,
  body: PostponeMyTaskRequest
): Promise<PostponeMyTaskResponse> => {
  const response = await authenticatedClient.patch<PostponeMyTaskResponse>(
    `/my-tasks/${occurrenceId}/schedule`,
    body
  );
  return response.data;
};

// 내 할일 부탁하기 
export const requestMyTaskAssignee = async (
  occurrenceId: number,
  payload: UpdateTaskAssigneeRequest
): Promise<UpdateTaskAssigneeResult> => {
  const response = await authenticatedClient.post<UpdateTaskAssigneeResult>(
    `/my-tasks/${occurrenceId}/request`,
    payload
  );
  return response.data;
};