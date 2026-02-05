import { authenticatedClient } from '@/features/auth/api/client';
import type { CategoryType, SubCategoryType, CategoryListResponse, AddCategoryRequest } from '../types/category.types';


// 카테고리 목록 조회
export interface GetCategoryListParams {
  category?: CategoryType;
  subCategory?: SubCategoryType;
  favorite?: boolean;
}

export const getCategoryList = async (
  params: GetCategoryListParams
): Promise<CategoryListResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.subCategory) queryParams.append('subCategory', params.subCategory);
  if (params.favorite !== undefined) queryParams.append('favorite', String(params.favorite));

  const queryString = queryParams.toString();
  const url = queryString ? `/task-types?${queryString}` : '/task-types';

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