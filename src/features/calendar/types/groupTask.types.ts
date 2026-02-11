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

/** 매니저 (예약/서비스) */
export type ManagerCallItem = {
  reservationItemId: number;
  serviceName: string;
  visitTime: string; // 예시가 string이므로 일단 string
  point: number;
};


//협약의 작성상태
export type AgreementStatus = 'NONE' | 'DRAFT' | 'CONFIRMED' ;

export type GroupTasksResult = {
  agreementStatus: AgreementStatus;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  weekDates: string[]; // ["YYYY-MM-DD", ...]
  selectedDate: string; // YYYY-MM-DD
  items: GroupTaskWeekItem[];
  managerCall: ManagerCallItem[];
  isSoloGroup: boolean; 
};

export type GroupTasksRequest = {
  groupId: number;
  date: string; // YYYY-MM-DD
};

export type ApiErrorResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: unknown;
};
