// 날짜를 YYYY-MM-DD 형식으로 포맷팅
export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// YYYY-MM-DD 문자열을 Date 객체로 변환
export const parseDateKey = (dateKey: string): Date => {
  return new Date(dateKey + 'T00:00:00');
};

// 날짜 범위 생성 (월의 첫날 ~ 마지막날)
export const getMonthDateRange = (date: Date): { startDate: string; endDate: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    startDate: formatDateKey(startDate),
    endDate: formatDateKey(endDate),
  };
};

// 날짜별로 할일을 그룹화
export const groupTasksByDate = (tasks: Array<{ date: string }>): Record<string, number> => {
  return tasks.reduce((acc, task) => {
    acc[task.date] = (acc[task.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};


// 같은 날짜인지 비교 (년/월/일)
export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// 특정 날짜가 속한 주(일~토) 7일 생성
export const getWeekDates = (base: Date): Date[] => {
  const week: Date[] = [];
  const day = base.getDay();
  const start = new Date(base);
  start.setDate(base.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    week.push(d);
  }
  return week;
};

// 월간 캘린더 그리드 날짜 생성 (앞/뒤 빈칸 포함해서 7의 배수)
export const getMonthGridDates = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const lastDay = new Date(year, month + 1, 0);
  const totalCells = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7) * 7;

  const dates: Date[] = [];
  const cur = new Date(start);
  for (let i = 0; i < totalCells; i++) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

// 해당 날짜가 그 달의 "첫 번째 주"에 속하는지
export const isInFirstWeekOfMonth = (date: Date): boolean => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const firstWeekStart = new Date(firstDay);
  firstWeekStart.setDate(firstDay.getDate() - firstDay.getDay());
  firstWeekStart.setHours(0, 0, 0, 0);

  const dateWeekStart = new Date(date);
  dateWeekStart.setDate(date.getDate() - date.getDay());
  dateWeekStart.setHours(0, 0, 0, 0);

  return firstWeekStart.getTime() === dateWeekStart.getTime();
};

