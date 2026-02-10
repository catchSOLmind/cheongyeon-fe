// 내 할일 추가 
// 내 할일 페이지에서 캘린더에 등록하기를 누르면 API 가 요청되는 형식
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
  time: string | null;            
  assignee: AddedAssignee | null;  
  repeat: AddedRepeat;            
};

//할당
export type AddedAssignee = {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
};

//반복주기
export type AddedRepeat = {
  enabled: boolean;
  daysOfWeek: string[];
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