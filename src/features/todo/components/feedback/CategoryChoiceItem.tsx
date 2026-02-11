import type { CategoryType } from '@/features/todo/types/category.types';

interface CategoryChoiceItemProps {
  categoryType: CategoryType;
  name: string;
  image?: string;
  isSelected: boolean;
  onClick: (categoryType: CategoryType) => void;
}

function CategoryChoiceItem({
  categoryType,
  name,
  image,
  isSelected,
  onClick,
}: CategoryChoiceItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(categoryType)}
      className={`
        w-full h-12 flex items-center gap-3 py-2.5 rounded-lg transition-colors
        ${isSelected ? 'bg-primary-50' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {/* 카테고리 이미지 */}
      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-6 h-6 object-contain"
          />
        ) : (
          <span className="text-xs">📦</span>
        )}
      </div>

      {/* 카테고리 이름 */}
      <span className="text-body-m text-gray-800">{name}</span>
    </button>
  );
}

export default CategoryChoiceItem;
