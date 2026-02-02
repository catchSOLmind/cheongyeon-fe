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