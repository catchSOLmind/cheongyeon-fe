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