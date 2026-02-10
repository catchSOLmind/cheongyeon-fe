// src/features/todo/stores/useTaskDraftStore.ts

/**
 * 🧠 useTaskDraftStore
 *
 * - '할 일 추가' 플로우에서 선택한 할 일을 서버에 보내기 전까지 임시로 관리하는 zustand store
 * - draftId 기준으로 식별 (taskTypeId 중복 가능)
 * - 페이지를 벗어나면 drafts는 유지되지 않음 (영속 저장 ❌)
 */

// src/features/todo/stores/useTaskDraftStore.ts
import { create } from 'zustand';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import type { CategoryType } from '../types/category.types';

export type DaysOfWeek = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export type RepeatDraft = {
  enabled: true;
  daysOfWeek: DaysOfWeek[];
};

export type AssigneeDraft = {
  memberId: number; // 여기 값은 profile.userId를 넣을 것
  nickname: string;
  profileImageUrl: string | null;
};

export type TaskDraft = {
  draftId: string;
  categoryType: CategoryType;
  taskTypeId: number;
  taskName: string;
  point: number;
  isFavorite: boolean;
  date: string;
  time: string | null;
  assignee?: AssigneeDraft;
  repeat?: RepeatDraft;
};

const fillAssigneeIfMissing = (draft: TaskDraft): TaskDraft => {
  if (draft.assignee) return draft;

  const me = useUserStore.getState().profile; // ✅ 훅 아님
  if (!me) return draft; // 프로필 아직 없으면 일단 그대로(나중에 AddTodoPage에서 보강 가능)

  return {
    ...draft,
    assignee: {
      memberId: me.userId,                // ✅ 너 profile 구조상 userId
      nickname: me.nickname,
      profileImageUrl: me.profileImageUrl ?? null,
    },
  };
};

type TaskDraftState = {
  drafts: TaskDraft[];
  addDraft: (draft: TaskDraft) => void;
  addDrafts: (drafts: TaskDraft[]) => void;
  updateDraft: (draftId: string, patch: Partial<TaskDraft>) => void;
  removeDraft: (draftId: string) => void;
  toggleFavoriteByTaskTypeId: (taskTypeId: number, isFavorite: boolean) => void;
  clear: () => void;
};

export const useTaskDraftStore = create<TaskDraftState>((set) => ({
  drafts: [],

  addDraft: (draft) =>
    set((state) => ({ drafts: [...state.drafts, fillAssigneeIfMissing(draft)] })),

  addDrafts: (drafts) =>
    set((state) => ({ drafts: [...state.drafts, ...drafts.map(fillAssigneeIfMissing)] })),

  updateDraft: (draftId, patch) =>
    set((state) => ({
      drafts: state.drafts.map((d) => {
        if (d.draftId !== draftId) return d;
        return fillAssigneeIfMissing({ ...d, ...patch });
      }),
    })),

  removeDraft: (draftId) =>
    set((state) => ({ drafts: state.drafts.filter((d) => d.draftId !== draftId) })),

  toggleFavoriteByTaskTypeId: (taskTypeId, isFavorite) =>
    set((state) => ({
      drafts: state.drafts.map((d) => (d.taskTypeId === taskTypeId ? { ...d, isFavorite } : d)),
    })),

  clear: () => set({ drafts: [] }),
}));
