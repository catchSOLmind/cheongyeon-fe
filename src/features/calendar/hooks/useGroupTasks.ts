import { useState, useEffect, useCallback } from 'react';
import { getGroupTasks } from '../api/groupTaskApi';
import type {
  AgreementStatus,
  GroupTasksRequest,
  GroupTaskWeekItem,
  ManagerCallItem,
} from '../types/groupTask.types';

interface UseGroupTasksOptions extends GroupTasksRequest {
  enabled?: boolean; // 자동 조회 여부
}

interface UseGroupTasksReturn {
  tasks: GroupTaskWeekItem[];
  weekDates: string[];
  isSoloGroup: boolean;
  agreementStatus: AgreementStatus;
  managerCall: ManagerCallItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 그룹 할 일 조회 hook
export const useGroupTasks = (options: UseGroupTasksOptions): UseGroupTasksReturn => {
  const { enabled = true, groupId, date } = options;

  const [tasks, setTasks] = useState<GroupTaskWeekItem[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isSoloGroup, setIsSoloGroup] = useState(false);
  const [agreementStatus, setAgreementStatus] = useState<AgreementStatus>('NONE');
  const [managerCall, setManagerCall] = useState<ManagerCallItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!groupId || groupId <= 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getGroupTasks({ groupId, date });

      setTasks(data.items ?? []);
      setWeekDates(data.weekDates ?? []);
      setIsSoloGroup(!!data.isSoloGroup);
      setAgreementStatus((data.agreementStatus ?? 'NONE') as AgreementStatus);
      setManagerCall(data.managerCall ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      console.error('Failed to fetch group tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, date]);

  useEffect(() => {
    if (enabled) fetchTasks();
  }, [enabled, fetchTasks]);

  return {
    tasks,
    weekDates,
    isSoloGroup,
    agreementStatus,
    managerCall,
    isLoading,
    error,
    refetch: fetchTasks,
  };
};
