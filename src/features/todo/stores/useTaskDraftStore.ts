// 할 일 추가 페이지 내에서 임시로 저장되는 할일 부분

import { create } from 'zustand';
import type { CategoryType } from '../types/category.types';

export type TaskDraft = {
  categoryType: CategoryType;
  taskTypeId: number;
  taskName: string;
  point: number;
  isFavorite: boolean;

  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm (현재시간 기본)
  weekday?: number;   // 0(Sun)~6(Sat) or 원하는 규칙 

  assigneeId?: number;   
  assigneeName?: string; 
};


type TaskDraftState = {
  drafts: TaskDraft[];
  setDrafts: (drafts: TaskDraft[]) => void;
  addOrReplaceDraft: (draft: TaskDraft) => void; // taskTypeId 기준으로 덮어쓰기
  removeDraft: (taskTypeId: number) => void;
  clear: () => void;
};

export const useTaskDraftStore = create<TaskDraftState>((set) => ({
  drafts: [],

  setDrafts: (drafts) => set({ drafts }),

  addOrReplaceDraft: (draft) =>
    set((state) => {
      const exists = state.drafts.some((d) => d.taskTypeId === draft.taskTypeId);
      return {
        drafts: exists
          ? state.drafts.map((d) => (d.taskTypeId === draft.taskTypeId ? draft : d))
          : [...state.drafts, draft],
      };
    }),

  removeDraft: (taskTypeId) =>
    set((state) => ({ drafts: state.drafts.filter((d) => d.taskTypeId !== taskTypeId) })),

  clear: () => set({ drafts: [] }),
}));
