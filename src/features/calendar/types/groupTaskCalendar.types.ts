/** YYYY-MM-DD */
export type ISODateString = `${number}-${number}-${number}`;

/** GET /api/my-tasks/calendar query */
export type GroupTasksCalendarRequest = {
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