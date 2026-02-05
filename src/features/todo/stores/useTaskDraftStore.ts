// src/features/todo/stores/useTaskDraftStore.ts

/**
 * 🧠 useTaskDraftStore
 *
 * [Purpose]
 * - '할 일 추가' 플로우에서 선택한 할 일을
 *   서버에 보내기 전까지 임시로 관리하는 zustand store
 *
 * [Usage]
 * const drafts = useTaskDraftStore((s) => s.drafts);
 * const addDraft = useTaskDraftStore((s) => s.addDraft);
 * const updateDraft = useTaskDraftStore((s) => s.updateDraft);
 * const removeDraft = useTaskDraftStore((s) => s.removeDraft);
 * const clearDrafts = useTaskDraftStore((s) => s.clear);
 * const toggleFavoriteByTaskTypeId = useTaskDraftStore((s) => s.toggleFavoriteByTaskTypeId);
 *
 *
 * [Flow]
 * 1. 할 일 선택 시
 *    → addDraft(draft)
 *
 * 2. draft 수정(날짜/시간/담당자 등)
 *    → updateDraft(draftId, patch)
 *
 * 3. draft 삭제
 *    → removeDraft(draftId)
 *
 * 4. '최종으로 캘린더에 추가하기' 버튼 클릭
 *    → drafts 기반으로 API 요청
 *    → 성공 시 clear()
 *
 * [Rule]
 * - draft는 draftId 기준으로 식별됨 (taskTypeId 중복 가능)
 * - 페이지를 벗어나면 drafts는 유지되지 않음 (영속 저장 ❌)
 * - 서버 API는 최종 확정 시점에만 호출됨
 */

import { create } from 'zustand';
import type { CategoryType } from '../types/category.types';

export type TaskDraft = {
  draftId: string; // 클라이언트에서만 쓰는 고유 id (taskTypeId 중복 허용)
  categoryType: CategoryType;
  taskTypeId: number;
  taskName: string;
  point: number;
  isFavorite: boolean;

  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  weekday?: number; // 0~6

  assigneeId?: number;
  assigneeName?: string;
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

  addDraft: (draft) =>
    set((state) => ({ drafts: [...state.drafts, draft] })),

  addDrafts: (drafts) =>
    set((state) => ({ drafts: [...state.drafts, ...drafts] })),

  updateDraft: (draftId, patch) =>
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.draftId === draftId ? { ...d, ...patch } : d
      ),
    })),

  removeDraft: (draftId) =>
    set((state) => ({
      drafts: state.drafts.filter((d) => d.draftId !== draftId),
    })),

  toggleFavoriteByTaskTypeId: (taskTypeId, isFavorite) =>
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.taskTypeId === taskTypeId ? { ...d, isFavorite } : d
      ),
    })),

  clear: () => set({ drafts: [] }),
}));
