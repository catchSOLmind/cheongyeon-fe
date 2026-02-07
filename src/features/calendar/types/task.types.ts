import type { CategoryType } from "@/features/todo/types/category.types";

// GET /my-tasks
// 내 할일 조회 요청
export interface MyTaskRequest {
  date: string; // YYYY-MM-DD
}

export type TaskStatus = 'WAITING' | 'IN_PROGRESS' | 'INCOMPLETED' | 'COMPLETED';

// 내 할일(주간) 아이템
export type MyTaskWeekItem = {
  occurrenceId: number;
  taskId: number;
  taskTypeId: number;
  category : CategoryType;
  taskName: string;
  point: number;
  time: string; 
  status: TaskStatus;
  primaryAssignedMemberId: number | null;
  takeover: boolean;
};

// 내 할일 조회 응답
export interface MyTaskResponse {
  weekStart: string;     // YYYY-MM-DD
  weekEnd: string;       // YYYY-MM-DD
  weekDates: string[];   // ["YYYY-MM-DD", ...]
  selectedDate: string;  // YYYY-MM-DD
  items: MyTaskWeekItem[];
}

// 내 할일 완료하기 
// POST /my-tasks/{occurrenceId}/complete
export interface MyTaskCompleteReponse {
  occurrenceId: number;
  status: TaskStatus;
  earnedPoint: number;
  completedAt: string | null; 
} 

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
