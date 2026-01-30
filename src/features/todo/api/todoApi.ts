import { authenticatedClient } from '@/features/auth/api/client';
import type { AddCategoryRequest, CategoryListResponse } from '../types/category.types';

// 카테고리 목록 조회
export const getCategoryList = async (): Promise<CategoryListResponse> => {
  const response = await authenticatedClient.get<CategoryListResponse>('/task-types');
  return response.data;
};

// 카테고리 목록에 없는 세부 항목 등록
export const addCategory = async (
  request: AddCategoryRequest
): Promise<CategoryListResponse> => {
  const response = await authenticatedClient.post<CategoryListResponse>(
    '/task-types',
    request
  );
  return response.data;
};