import type { CategoryType } from '@/features/todo/types/category.types';

export type TaskStatus = 'WAITING' | 'IN_PROGRESS' | 'INCOMPLETED' | 'COMPLETED';

export type GroupTaskAssignee = {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export type GroupTaskWeekItem = {
  occurrenceId: number;
  taskId: number;
  taskTypeId: number;
  taskName: string;
  category: CategoryType;
  point: number;
  time: string | null;
  status: TaskStatus;
  assignee: GroupTaskAssignee;
  takeover: boolean;
};

export type GroupTasksResult = {
  weekStart: string;     // YYYY-MM-DD
  weekEnd: string;       // YYYY-MM-DD
  weekDates: string[];   // ["YYYY-MM-DD", ...]
  selectedDate: string;  // YYYY-MM-DD
  items: GroupTaskWeekItem[];
};

export type GroupTasksRequest = {
  groupId: number;
  date: string; // YYYY-MM-DD
};

// (너희 공통 에러 응답이 있는 걸로 보여서 같이 둠)
export type ApiErrorResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: unknown;
};
