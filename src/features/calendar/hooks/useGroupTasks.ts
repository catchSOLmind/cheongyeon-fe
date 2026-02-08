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
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 그룹 할 일 조회 hook
export const useGroupTasks = (
  options: UseGroupTasksOptions
): UseGroupTasksReturn => {
  const { enabled = true, groupId, date } = options; // 구조 분해 할당

  const [tasks, setTasks] = useState<GroupTaskWeekItem[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    // groupId 유효성 검사 추가
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      console.error('Failed to fetch group tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, date]); // 원시값으로 의존성 설정

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