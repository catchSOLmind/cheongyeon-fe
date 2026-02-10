// src/features/todo/types/draftTask.types.ts
import type { CategoryType } from './category.types';

// 바텀시트에서 선택하고 캘린더에 추가하기 전까지 UI에서 쓰는 타입
export type DraftRepeat = {
  enabled: true;
  daysOfWeek: ('SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT')[];
};

export type DraftAssignee = {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export interface DraftTaskItemData {
  id: string;
  taskTypeId: number;
  categoryType: CategoryType;
  title: string;
  date: string;
  time: string | null;
  points: number;

  // 기본은 "나"로 세팅해서 내려줄 거라 UI에서는 항상 존재하는 형태로 써도 됨
  assignee: DraftAssignee;

  // enabled=false면 repeat 자체가 없어야 함
  repeat?: DraftRepeat;

  // UI 표시용
  tag?: string;

  isFavorite: boolean;
  isCompleted: boolean;
}
