// src/features/todo/components/TodoListItem.tsx

import type { CategoryItem } from '@/features/todo/types/category.types';
import IconStarFill from '@/assets/todo/icon-star-fill.svg';
import IconStar from '@/assets/todo/icon-star.svg';
import IconCoin from '@/assets/todo/icon-coin.svg';
import { categories } from '@/features/todo/data/categoryTypeImages'; 

interface AddTodoListItemProps {
  item: CategoryItem;
  isSelected?: boolean;
  onClick?: (item: CategoryItem) => void;
}

function AddTodoListItem({ item, isSelected = false, onClick }: AddTodoListItemProps) {
  // item.category에 해당하는 이미지 찾기 
  const categoryData = categories.find(c => c.categoryType === item.category);

  return (
  <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(item)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(item)}
      className={[
        'p-3 rounded-xl cursor-pointer transition-all',
        isSelected ? 'bg-[#EFFBFD] ring-1 ring-primary-500' : 'bg-white',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* 청소 카테고리 이미지 영역 */}
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            {categoryData?.image && (
              <img src={categoryData.image} alt={item.category} className="w-6 h-6" />
            )}
          </div>
          {/* 텍스트 영역 */}
          <div className="flex-1">
            <h3 className="text-body-m-bold text-gray-800 mb-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-body-s text-gray-600">
                <img src={IconCoin} alt="포인트" className="-mt-0.5 h-4 inline-block mr-1" />
                {item.point} 포인트
              </span>
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
    </div>
  );
}   

export default AddTodoListItem;