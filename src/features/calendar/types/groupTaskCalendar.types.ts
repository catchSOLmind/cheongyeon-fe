/** YYYY-MM-DD */
export type ISODateString = `${number}-${number}-${number}`;

/** GET /api/my-tasks/calendar query */
export type GroupTasksCalendarParams = {
  groupId : number;
  year: number;  // int32
  month: number; // int32 (1~12)
};

/** 200 OK */
export type GroupTasksCalendarResponse = {
  year: number;
  month: number;
  taskDates: ISODateString[];
};

/** 공통 에러 응답(스웨거 예시 기준) */
export type ApiErrorResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Record<string, never> | unknown;
};
