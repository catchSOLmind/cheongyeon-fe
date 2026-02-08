import type { MyTaskWeekItem } from '../types/task.types';

// 기존 Task 타입 (컴포넌트에서 사용)
export interface Task {
  id: string;
  occurrenceId: number; // API 호출에 필요
  title: string;
  date: string; // YYYY-MM-DD
  time?: string | null;
  completed: boolean;
  status?: '대기중' | '진행중' | '완료';
  assignedTo?: {
    id: string;
    nickname: string;
    imageUrl?: string;
  };
}

// TaskItem을 Task로 변환
export const taskItemToTask = (item: MyTaskWeekItem, date: string): Task => {
  return {
    id: item.occurrenceId.toString(),
    occurrenceId: item.occurrenceId, // API 호출에 필요
    title: item.taskName,
    date: date,
    time: item.time,
    completed: item.status === 'COMPLETED',
    status: item.status === 'COMPLETED' ? '완료' : '대기중',
    // TODO: primaryAssignedMemberId로 멤버 정보 조회 필요
    assignedTo: undefined,
  };
};

// TaskItem 배열을 Task 배열로 변환 (요청한 날짜 기준)
export const taskItemsToTasks = (items: MyTaskWeekItem[], requestDate: string): Task[] => {
  return items.map((item) => taskItemToTask(item, requestDate));
};

// TaskItem 배열을 날짜별로 그룹화 (캘린더 표시용)
export const groupTaskItemsByDate = (items: MyTaskWeekItem[], weekDates: string[]): Record<string, number> => {
  // 서버 응답 구조상 items에 날짜 정보가 없으므로,
  // weekDates의 각 날짜에 대해 items 개수를 균등 분배하거나
  // 실제로는 서버에서 날짜별로 필터링된 데이터가 올 것으로 예상
  // 일단 weekDates의 각 날짜에 items.length를 반환
  const result: Record<string, number> = {};
  const itemsPerDate = Math.ceil(items.length / weekDates.length);
  
  weekDates.forEach((date, index) => {
    const startIndex = index * itemsPerDate;
    const endIndex = Math.min(startIndex + itemsPerDate, items.length);
    result[date] = endIndex - startIndex;
  });
  
  return result;
};
