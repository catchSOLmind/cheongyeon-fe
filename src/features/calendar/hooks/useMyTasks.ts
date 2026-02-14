import { useState, useEffect, useCallback } from 'react';
import { getMyTasks } from '../api/taskApi';
import type { MyTaskRequest, MyTaskWeekItem } from '../types/task.types';

// hook 요청 타입 
interface UseMyTasksOptions extends MyTaskRequest {
  enabled?: boolean; // hook 동작 제어 옵션
}

// hook Return 구조 
interface UseMyTasksReturn {
  tasks: MyTaskWeekItem[];
  weekDates: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 내 할일 조회 hook
export const useMyTasks = (options: UseMyTasksOptions): UseMyTasksReturn => {
  const { enabled = true, date } = options;
  const [tasks, setTasks] = useState<MyTaskWeekItem[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await getMyTasks({ date });
    setTasks(data.items);
    setWeekDates(data.weekDates);
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
  } finally {
    setIsLoading(false);
  }
}, [date]);

  useEffect(() => {
    if (enabled) {
      fetchTasks();
    }
  }, [enabled, fetchTasks]);

  return {
    tasks,
    weekDates,
    isLoading,
    error,
    refetch: fetchTasks,
  };
};
