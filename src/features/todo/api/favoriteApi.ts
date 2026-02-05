import { authenticatedClient } from '@/features/auth/api/client';
import type { FavoriteResponse } from '../types/favorite.types';

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


