/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * ⭐ useFavoriteStore
 *
 * [What]
 * - taskTypeId 기준 즐겨찾기 전역 상태 관리
 * - 즐겨찾기는 Draft ❌ / 즉시 서버 반영 ⭕️
 *
 * [Use]
 * - fetchFavorites() : 즐겨찾기 목록 초기 로딩
 * - isFavorite(id)   : 해당 taskType 즐겨찾기 여부
 * - toggleFavorite(id) : 즐겨찾기 추가/해제 (POST/DELETE)
 *
 * [Where]
 * - 바텀시트 열릴 때 → fetchFavorites()
 * - 별 클릭 시 → toggleFavorite(taskTypeId)
 *
 * [Rule]
 * - taskTypeId 기준
 * - UI는 낙관적 업데이트, 실패 시 롤백
 */

import { create } from 'zustand';
import { getFavoriteTaskTypes, postFavorite, deleteFavorite } from '../api/favoriteApi';

type FavoriteState = {
  /** 즐겨찾기된 taskTypeId 집합 */
  favoriteIds: Set<number>;
  isLoading: boolean;

  fetchFavorites: () => Promise<void>;
  isFavorite: (taskTypeId: number) => boolean;

  toggleFavorite: (taskTypeId: number) => Promise<void>;
};

// 즐겨찾기 목록 조회 
export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: new Set(),
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await getFavoriteTaskTypes();
      // taskTypeId만 Set으로 관리
      const ids = new Set(res.result.items.map((it) => it.taskTypeId));
      set({ favoriteIds: ids, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      console.error('fetchFavorites 실패', e);
    }
  },

  // 특정 taskTypeId가 즐겨찾기인지 확인
  isFavorite: (taskTypeId) => get().favoriteIds.has(taskTypeId),

  // 즐겨찾기 토글
  toggleFavorite: async (taskTypeId) => {
    const prev = get().favoriteIds;
    const next = new Set(prev);
    const willBeFavorite = !next.has(taskTypeId);

    // UI 먼저 반영(낙관적 업데이트)
    if (willBeFavorite) next.add(taskTypeId);
    else next.delete(taskTypeId);
    set({ favoriteIds: next });

    try {
      if (willBeFavorite) await postFavorite(taskTypeId);
      else await deleteFavorite(taskTypeId);
    } catch (e) {
      // ❌ 실패하면 롤백
      set({ favoriteIds: prev });
      alert('즐겨찾기 변경 실패');
    }
  },
}));
