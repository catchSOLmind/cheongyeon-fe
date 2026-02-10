// 내 할일 추가 
// 내 할일 페이지에서 캘린더에 등록하기를 누르면 API 가 요청되는 형식
// 요청 바디
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
