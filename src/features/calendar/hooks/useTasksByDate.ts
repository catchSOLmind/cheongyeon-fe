import { useMemo } from 'react';
import type { Task } from '../utils/taskAdapter';
import { groupTasksByDate } from '../utils/date.utils';

// 할일 배열을 날짜별 개수로 변환하는 hook
export const useTasksByDate = (tasks: Task[]): Record<string, number> => {
  return useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);
};
