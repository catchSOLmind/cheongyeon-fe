
// 내 할일 조회 요청
export interface MyTaskRequest {
  groupId: number;
  date: string; // YYYY-MM-DD
}

// 내 할일 조회 응답
export interface MyTaskResponse {
  weekDates: string[]; // ["YYYY-MM-DD", ...]
  items: TaskItem[];
}

// 할일 아이템 (API 응답)
export interface TaskItem {
  occurrenceId: number;
  taskId: number;
  taskTypeId: number;
  taskName: string;
  time: string | null; // "HH:mm" 형식 또는 null
  status: 'UNCOMPLETED' | 'COMPLETED';
  isTakeover: boolean;
  primaryAssignedMemberId: number;
}

// 할일 상태 업데이트 요청
export interface UpdateTaskStatusRequest {
  occurrenceId: number;
  status: 'UNCOMPLETED' | 'COMPLETED';
  doneByMemberId: number;
  doneAt: string; // YYYY-MM-DD HH:mm:ss
  updatedAt: string; // YYYY-MM-DD HH:mm:ss
}
