// src/features/todo/components/TodoListItem.tsx

import type { CategoryItem } from '@/features/todo/types/category.types';
import IconStarFill from '@/assets/todo/icon-star-fill.svg';
import IconStar from '@/assets/todo/icon-star.svg';
import IconCoin from '@/assets/todo/icon-coin.svg';

interface AddTodoListItemProps {
  item: CategoryItem;
  onClick?: (item: CategoryItem) => void;
}

function AddTodoListItem({ item, onClick }: AddTodoListItemProps) {
  return (
    <div
      onClick={() => onClick?.(item)}
      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* 아이콘 영역 */}
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">🧹</span>
          </div>
          
          {/* 텍스트 영역 */}
          <div className="flex-1">
            <h3 className="text-body-m-bold text-black mb-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-body-s text-gray-600">
                {item.category}
              </span>
              <span className="text-body-s text-primary-500">
                <img src={IconCoin} alt="포인트" className="w-4 h-4 inline-block mr-1" />
                {item.point} 포인트
              </span>
            </div>
          </div>
        </div>

        {/* 즐겨찾기 별 */}
        <img 
          src={item.isFavorite ? IconStarFill : IconStar}
          alt="즐겨찾기"
          className="w-6 h-6"
        />
    </div>
    </div>
  );
}   

export default AddTodoListItem;