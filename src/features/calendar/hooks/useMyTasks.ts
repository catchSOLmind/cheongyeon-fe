import { useState, useEffect } from 'react';
import { getMyTasks } from '../api/taskApi';
import type { MyTaskRequest, TaskItem } from '../types/task.types';

interface UseMyTasksOptions extends MyTaskRequest {
  enabled?: boolean; // 자동 조회 여부
}

interface UseMyTasksReturn {
  tasks: TaskItem[];
  weekDates: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 내 할일 조회 hook
export const useMyTasks = (options: UseMyTasksOptions): UseMyTasksReturn => {
  const { enabled = true, ...params } = options;
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = async () => {
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
  };

  useEffect(() => {
    if (enabled) {
      fetchTasks();
    }
  }, [params.groupId, params.date, enabled]);

  return {
    tasks,
    weekDates,
    isLoading,
    error,
    refetch: fetchTasks,
  };
};
