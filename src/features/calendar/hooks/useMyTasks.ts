import { useState, useEffect, useCallback } from 'react';
import { getMyTasks } from '../api/taskApi';
import type { MyTaskRequest, MyTaskWeekItem } from '../types/task.types';

interface UseMyTasksOptions extends MyTaskRequest {
  enabled?: boolean; // 자동 조회 여부
}

interface UseMyTasksReturn {
  tasks: MyTaskWeekItem[];
  weekDates: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 내 할일 조회 hook
export const useMyTasks = (options: UseMyTasksOptions): UseMyTasksReturn => {
  const { enabled = true, ...params } = options;
  const [tasks, setTasks] = useState<MyTaskWeekItem[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyTasks(params);
      setTasks(data.items);
      setWeekDates(data.weekDates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setIsLoading(false);
    }
  }, [params.date]);

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
