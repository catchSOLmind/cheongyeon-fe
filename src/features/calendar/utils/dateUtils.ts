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
