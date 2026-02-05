import type { CategoryType } from  '@/features/todo/types/category.types'

// 즐겨찾기
export interface Favorite {
  taskTypeId: number;
  isFavorite: boolean;
}

// 즐겨찾기 응답
export interface FavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    taskTypeId: number;
    isFavorite: boolean;
  };
}

// GET /api/task-types/favorites 응답의 item
// 즐겨찾기 된 task 조회
export interface FavoriteTaskTypeItem {
  taskTypeId: number;
  category: CategoryType;    
  subCategory: string;        
  name: string;
  point: number;
  isFavorite: true;            // 이 API는 favorites만 내려주니까 항상 true
}

// GET /api/task-types/favorites 응답
export interface FavoriteTaskTypesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    items: FavoriteTaskTypeItem[];
  };
}