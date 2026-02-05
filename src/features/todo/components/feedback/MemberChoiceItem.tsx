interface MemberChoiceItemProps {
  id: string;
  name: string;
  profileImageUrl?: string;
  tag?: string;
  isSelected: boolean;
  onClick: () => void;
}

function MemberChoiceItem({
  name,
  profileImageUrl,
  tag,
  isSelected,
  onClick,
}: MemberChoiceItemProps) {
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

      {/* 태그 */}
      {tag && (
        <span className="inline-block px-2 py-1 bg-primary-50 text-primary-400 text-label-m rounded-lg shrink-0">
          {tag}
        </span>
      )}
    </button>
  );
}

export default MemberChoiceItem;