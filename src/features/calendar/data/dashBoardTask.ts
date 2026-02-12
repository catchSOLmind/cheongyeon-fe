// data/dashBoardTask.ts
import type { CategoryType } from '@/features/todo/types/category.types';

export const categoryMetaMap = new Map<CategoryType, string>([
  ['BATHROOM', '화장실'],
  ['KITCHEN', '주방'],
  ['LAUNDRY', '빨래'],
  ['BEDROOM', '침실'],
  ['LIVING', '거실'],
  ['TRASH', '쓰레기'],
  ['ETC', '기타'],
]);
