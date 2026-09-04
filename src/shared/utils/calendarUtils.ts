export type CalendarCell = {
  day: number;
  isCurrentMonth: boolean;
};

/**
 * 주어진 연/월의 달력 셀 배열을 반환해요.
 * 이전 달 / 현재 달 / 다음 달 날짜를 포함하며 7의 배수로 채워져요.
 */
export function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const firstWeekday = firstDayOfMonth.getDay(); // 0(일) ~ 6(토)
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  const cells: CalendarCell[] = [];

  // 이전 달 채우기
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }

  // 이번 달 채우기
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }

  // 다음 달 채우기 (7의 배수 맞추기)
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, isCurrentMonth: false });
    nextDay += 1;
  }

  return cells;
}

/**
 * "26년 2월" 형태의 월 라벨을 반환해요.
 */
export function formatMonthLabel(year: number, month: number): string {
  return `${String(year).slice(2)}년 ${month}월`;
}