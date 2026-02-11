import type { DaysOfWeek } from "@/features/todo/stores/useTaskDraftStore";
import type { CategoryType } from "@/features/todo/types/category.types";

export type TaskStatus = 'WAITING' | 'IN_PROGRESS' | 'INCOMPLETED' | 'COMPLETED';

export interface TaskTypeInfo {
  taskTypeId: number;
  category: CategoryType;
  name: string;
  point: number;
}

export interface RepeatInfo {
  enabled: boolean;
  daysOfWeek: DaysOfWeek[];
}

export interface AssigneeInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface MyTaskDetailResponse {
  occurrenceId: number;
  taskId: number;
  groupId: number;
  taskType: TaskTypeInfo;
  date: string; // "YYYY-MM-DD" 예상 (스웨거엔 string)
  time: string | null; // 없는 경우 대비
  repeat: RepeatInfo | null; // 없는 경우 대비
  assignee: AssigneeInfo | null; // 없는 경우 대비
  status: TaskStatus;
  isTakeover: boolean;
}
