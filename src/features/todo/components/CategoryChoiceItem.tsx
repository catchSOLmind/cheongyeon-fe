interface CategoryChoiceItemProps {
    id: string;
    name: string;
    profileImageUrl?: string;
    isSelected: boolean;
    onClick: () => void;
  }
  
  function CategoryChoiceItem({
    name,
    profileImageUrl,
    isSelected,
    onClick,
  }: CategoryChoiceItemProps) {
    return (
      <button
        onClick={onClick}
        className={`
          w-full h-12 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
          ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}
        `}
      >
        {/* 프로필 이미지 */}
        <div className="w-8 h-8 rounded-full border border-blue-200 overflow-hidden shrink-0">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs">🐕</span>
            </div>
          )}
        </div>
  
        {/* 이름 */}
        <span className="text-body-m text-gray-800">{name}</span>
  
      </button>
    );
  }
  
  export default CategoryChoiceItem;