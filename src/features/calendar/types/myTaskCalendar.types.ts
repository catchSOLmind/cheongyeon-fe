/** YYYY-MM-DD */
export type ISODateString = `${number}-${number}-${number}`;

/** GET /api/my-tasks/calendar query */
export type MyTasksCalendarRequest = {
  year: number;  // int32
  month: number; // int32 (1~12)
};

/** 200 OK */
export type MyTasksCalendarResponse = {
  year: number;
  month: number;
  taskDates: ISODateString[];
};