// 카테고리 목록 응답
export interface CategoryListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    items: Category[];
  };
}

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

//세부 항목 등록하기 
export interface AddCategoryRequest {
    category: CategoryType;
    subCategory?: SubCategoryType;
    name: string;
}

