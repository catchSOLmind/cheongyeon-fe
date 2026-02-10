import type { TaskStatus } from "./task.types";

// 내 할일 상태 변경하기 
export type IncompleteReasonCode =
  | 'BUSY'    // 일정이 바빠요
  | 'SICK'    // 몸이 안 좋았어요
  | 'FORGOT'  // 깜빡했어요
  | 'NO_TOOL' // 청소 도구가 없었어요
  | 'ETC';    // 기타


// 상태 변경 요청 하기 
// PATCH /my-tasks/{occurrenceId}/status
export interface UpdateMyTaskStatusRequest {
  status: TaskStatus;
  /** status === 'INCOMPLETED' 일 때만 사용 */
  reasonCode?: IncompleteReasonCode;
  reasonText?: string;
}

//상태 변경 응답
export interface UpdateMyTaskStatusResponse {
  occurrenceId: number;
  status: TaskStatus;

  incompleteReason?: {
    reasonCode: IncompleteReasonCode;
    reasonText?: string | null;
  } | null;

  updatedAt: string; // ISO datetime
}


// 내 할일 삭제하기 
export interface DeleteMyTaskRequest {
  occurrenceId: number;
}

export interface DeleteMyTaskResponse {
  occurrenceId: number;
  deletedAt: string; // ISO 8601 datetime string
}

export interface ErrorResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Record<string, unknown>;
}

// 내 할일 미루기 
export type PostponeReasonCode = 
    |'NO_TIME'                  // 시간이 부족해요
    |'ANOTHER_SCHEDULE'      // 다른 일정이 생겨
    |'SICK'                 // 몸이 안 좋아요
    |'NO_TOOL'              // 청소 도구가 없어요
    |'FORGOT'               // 깜빡했어요
    |'NO_HOME'              // 집에 없어요
    |'ETC';                 // 기타

export interface PostponeMyTaskRequest {
  date: string;
  time: string;
  postponeReasonCode?: PostponeReasonCode | null;
  postponeReasonText?: string | null;
}

export interface PostponeReason {
  reasonCode: PostponeReasonCode;
  reasonText: string | null;
}

export interface PostponeMyTaskResponse {
  occurrenceId: number;
  date: string;
  time: string;
  postponeReason: PostponeReason | null;
  updatedAt: string;
}

