import { useState, useEffect, useCallback } from 'react';
import { getGroupTasks } from '../api/groupTaskApi';
import type {
  GroupTasksRequest,
  GroupTaskWeekItem,
} from '../types/groupTask.types';

interface UseGroupTasksOptions extends GroupTasksRequest {
  enabled?: boolean; // 자동 조회 여부
}

interface UseGroupTasksReturn {
  tasks: GroupTaskWeekItem[];
  weekDates: string[];
  isSoloGroup: boolean; // ✅ 추가
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 그룹 할 일 조회 hook
export const useGroupTasks = (
  options: UseGroupTasksOptions
): UseGroupTasksReturn => {
  const { enabled = true, groupId, date } = options;

  const [tasks, setTasks] = useState<GroupTaskWeekItem[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isSoloGroup, setIsSoloGroup] = useState(false); // ✅ 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!groupId || groupId <= 0) {
      console.log('Invalid groupId:', groupId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getGroupTasks({ groupId, date });

      setTasks(data.items);
      setWeekDates(data.weekDates);
      setIsSoloGroup(data.isSoloGroup); 
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      console.error('Failed to fetch group tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, date]);

  useEffect(() => {
    if (enabled) {
      fetchTasks();
    }
  }, [enabled, fetchTasks]);

  return {
    tasks,
    weekDates,
    isSoloGroup, 
    isLoading,
    error,
    refetch: fetchTasks,
  };
};
