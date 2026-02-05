// 카테고리 목록 응답
export interface CategoryListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    items: Category[];
  };
}

// 카테고리 항목
export interface Category {
    taskTypeId: number;
    category: 'BATHROOM' | 'KITCHEN' | 'LAUNDRY' | 'BEDROOM' | 'LIVING' | 'TRASH' | 'ETC';
    subCategory?: "PET" | "BABY" | "OTHER";
    name: string;
    point: number;
    isFavorite: boolean;
  }

//세부 항목 등록하기 
export interface AddCategoryRequest {
    category: 'BATHROOM' | 'KITCHEN' | 'LAUNDRY' | 'BEDROOM' | 'LIVING' | 'TRASH' | 'ETC';
    subCategory?: "PET" | "BABY" | "OTHER";
    name: string;
}

