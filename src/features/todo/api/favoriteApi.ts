import { authenticatedClient } from '@/features/auth/api/client';
import type { FavoriteResponse , FavoriteTaskTypesResponse } from '../types/favorite.types';

// 즐겨찾기 추가
export const postFavorite = async (taskTypeId: number): Promise<FavoriteResponse> => {
  const response = await authenticatedClient.post<FavoriteResponse>(
    `/task-types/${taskTypeId}/favorite`
  );
  return response.data;
};

// 즐겨찾기 삭제
export const deleteFavorite = async (taskTypeId: number): Promise<FavoriteResponse> => {
  const response = await authenticatedClient.delete<FavoriteResponse>(
    `/task-types/${taskTypeId}/favorite`
  );
  return response.data;
};

// 즐겨찾기 목록 조회
export const getFavoriteTaskTypes = async (): Promise<FavoriteTaskTypesResponse> => {
  const { data } = await authenticatedClient.get<FavoriteTaskTypesResponse>(
    '/task-types/favorites'
  );
  return data;
};


