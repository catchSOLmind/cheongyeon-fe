// 내 할일 추가 
// 내 할일 페이지에서 캘린더에 등록하기를 누르면 API 가 요청되는 형식
// 요청 바디
// src/features/todo/types/myTask.types.ts

// 요청 타입 추가
export type AddTasksRequest = {
  tasks: AddTaskRequest[];
};

export type AddTaskRequest = {
  date: string; // "2026-02-10" 형식
  taskTypeId: number;
  time: string | null;
  assigneeMemberId: number | null;
  repeat: AddTaskRepeat;
};

export type AddTaskRepeat = {
  enabled: boolean;
  daysOfWeek: string[];
};

// 응답 타입 (이미 정의되어 있는 것)
export type AddTasksResponse = {
  createdCount: number;
  created: AddedTask[];
};

export type AddedTask = {
  taskId: number;
  occurrenceId: number;
  taskTypeId: number;
  taskName: string;
  point: number;
  time: string | null;
  assignee: AddedAssignee | null;
  repeat: AddedRepeat;
};

export type AddedAssignee = {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export type AddedRepeat = {
  enabled: boolean;
  daysOfWeek: string[];
};