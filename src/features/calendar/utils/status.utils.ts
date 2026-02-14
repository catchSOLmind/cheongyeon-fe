// TASK ITEM 에서 상태를 괸리하는 타입
import type { TaskStatus } from '../types/task.types';

type StatusUI = {
  label: string;
  className: string;
};

const STATUS_MAP: Record<TaskStatus, StatusUI> = {
  WAITING: {
    label: '대기중',
    className: 'bg-primary-50 text-primary-400',
  },
  IN_PROGRESS: {
    label: '진행중',
    className: 'bg-primary-50 text-primary-400',
  },
  COMPLETED: {
    label: '완료',
    className: 'bg-primary text-white',
  },
  INCOMPLETED: {
    label: '미완료',
    className: 'bg-gray-100 text-gray-700',
  },
};

export const getStatusUI = (status: TaskStatus): StatusUI => {
  return STATUS_MAP[status] ?? STATUS_MAP.WAITING;
};
