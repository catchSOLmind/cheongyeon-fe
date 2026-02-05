
// 바텀시트를 열었을 때 카테고리별 가사 목록들
export type CategoryType = 'BATHROOM' | 'KITCHEN' | 'LAUNDRY' | 'BEDROOM' | 'LIVING' | 'TRASH' | 'ETC';
export type SubCategoryType = "PET" | "BABY" | "OTHER";

// 카테고리 항목
export interface CategoryItem {
  taskTypeId: number;
  category: CategoryType;
  subCategory?: SubCategoryType;
  name: string;
  point: number;
  isFavorite: boolean;
}

// 카테고리 조회 요청 파라미터
export interface GetCategoryListParams {
  category?: CategoryType;
  subCategory?: SubCategoryType;
  favorite?: boolean;
}


// 카테고리 목록 응답
export interface CategoryListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    items: CategoryItem[]; 
  };
}


//세부 항목 등록하기 
export interface AddCategoryRequest {
    category: CategoryType;
    subCategory?: SubCategoryType;
    name: string;
}

