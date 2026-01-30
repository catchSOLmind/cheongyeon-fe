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
    category: string;
    name: string;
    isFavorite: boolean;
  }

//세부 항목 등록하기 
export interface AddCategoryRequest {
    taskTypeId: number;
    category: string;
    name: string;
    // 추후 추가될 필드
    //isFavorite: boolean;
}

