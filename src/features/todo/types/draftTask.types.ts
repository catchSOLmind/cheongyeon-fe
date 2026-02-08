import type { CategoryType } from "./category.types";


// 바텀시트에서 선택하고 캘린더에 추가하기 전까지는 zustand 에서 다음과 같은 타입으로 상태관리
export interface DraftTaskItemData {
  id: string;
  taskTypeId: number;
  categoryType: CategoryType;
  title: string;
  date: string;
  time: string;
  points: number;
  assignee: {
    name: string;
    avatar?: string;
  };
  tag?: string;
  isFavorite: boolean;
  isCompleted: boolean;
}

