// src/features/todo/stores/useTaskDraftStore.ts

/**
 * 🧠 useTaskDraftStore
 *
 * - '할 일 추가' 플로우에서 선택한 할 일을 서버에 보내기 전까지 임시로 관리하는 zustand store
 * - draftId 기준으로 식별 (taskTypeId 중복 가능)
 * - 페이지를 벗어나면 drafts는 유지되지 않음 (영속 저장 ❌)
 */

import { create } from 'zustand';
import type { CategoryType } from '../types/category.types';

export type DaysOfWeek = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export type RepeatDraft = {
  enabled: true; // ✅ enabled=false는 저장하지 않음(=repeat undefined)
  daysOfWeek: DaysOfWeek[];
};

export type AssigneeDraft = {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export type TaskDraft = {
  draftId: string; // 클라이언트에서만 쓰는 고유 id (taskTypeId 중복 허용)
  categoryType: CategoryType;
  taskTypeId: number;
  taskName: string;
  point: number;
  isFavorite: boolean;

  date: string; // YYYY-MM-DD
  time: string | null; // HH:mm or null

  // ✅ 기본은 "나"로 AddTodoPage에서 보강해주지만,
  // store 자체는 "선택/수정 시" 저장될 수 있으니 optional로 둠
  assignee?: AssigneeDraft;

  // ✅ enabled=false면 repeat 자체를 없앰
  repeat?: RepeatDraft;
};

type TaskDraftState = {
  drafts: TaskDraft[];

  addDraft: (draft: TaskDraft) => void;
  addDrafts: (drafts: TaskDraft[]) => void; // 여러 개 한번에 추가(바텀시트용)
  updateDraft: (draftId: string, patch: Partial<TaskDraft>) => void;
  removeDraft: (draftId: string) => void;
  toggleFavoriteByTaskTypeId: (taskTypeId: number, isFavorite: boolean) => void;
  clear: () => void;
};

export const useTaskDraftStore = create<TaskDraftState>((set) => ({
  drafts: [],

  addDraft: (draft) => set((state) => ({ drafts: [...state.drafts, draft] })),

  addDrafts: (drafts) => set((state) => ({ drafts: [...state.drafts, ...drafts] })),

  updateDraft: (draftId, patch) =>
    set((state) => ({
      drafts: state.drafts.map((d) => (d.draftId === draftId ? { ...d, ...patch } : d)),
    })),

  removeDraft: (draftId) =>
    set((state) => ({
      drafts: state.drafts.filter((d) => d.draftId !== draftId),
    })),

  toggleFavoriteByTaskTypeId: (taskTypeId, isFavorite) =>
    set((state) => ({
      drafts: state.drafts.map((d) => (d.taskTypeId === taskTypeId ? { ...d, isFavorite } : d)),
    })),

  clear: () => set({ drafts: [] }),
}));
