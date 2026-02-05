import { authenticatedClient } from '@/features/auth/api/client';
import type { AddCategoryRequest, CategoryListResponse } from '../types/category.types';

export interface GetCategoryListParams {
  groupId: number; // required 추가
  category?: string;
  favorite?: boolean;
  q?: string;
}

export const getCategoryList = async (
  params: GetCategoryListParams // optional 제거
): Promise<CategoryListResponse> => {
  const queryParams = new URLSearchParams();
  
  // groupId는 필수
  queryParams.append('groupId', String(params.groupId));
  
  if (params.category) queryParams.append('category', params.category);
  if (params.favorite !== undefined) queryParams.append('favorite', String(params.favorite));
  if (params.q) queryParams.append('q', params.q);

  const queryString = queryParams.toString();
  const url = `/task-types?${queryString}`;
  
  // 로그
  console.log('[getCategoryList] params:', params);
  console.log('[getCategoryList] url:', url);
  
  const response = await authenticatedClient.get<CategoryListResponse>(url);
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