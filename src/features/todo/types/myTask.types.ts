//내 할일 추가 

// 요청 바디
export type AddTasksRequest = {
  date: string; // "YYYY-MM-DD"
  taskTypeIds: number[];
};

// 추가된 task 정보
export type AddedTask = {
  taskId: number;
  occurrenceId: number;
  taskTypeId: number;
  taskName: string;
  point: number;
};

// 200 OK 응답 바디
export type AddTasksResponse = {
  createdCount: number;
  created: AddedTask[];
};

// 공통 에러 응답 바디
export type ApiErrorResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: unknown; 
};
