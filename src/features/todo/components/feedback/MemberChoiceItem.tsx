import ImgDefault from "@/assets/common/img-default-profile.svg";

interface MemberChoiceItemProps {
  groupMemberId: number; // string → number로 변경
  nickname: string;
  profileImageUrl?: string | null;
  testResultTypeLabel?: string | null; // FeedbackPage에서 전달하는 prop 이름과 일치
  isSelected: boolean;
  onClick: () => void;
}

function MemberChoiceItem({
  nickname,
  profileImageUrl,
  testResultTypeLabel, // testResultType → testResultTypeLabel
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
            alt={nickname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <img src={ImgDefault} alt="기본 프로필" />
          </div>
        )}
      </div>

      {/* 이름 */}
      <span className="text-body-m text-gray-800">{nickname}</span>

      {/* 태그 */}
      {testResultTypeLabel && (
        <span className="inline-block px-2 py-1 bg-primary-50 text-primary-400 text-label-m rounded-lg shrink-0">
          {testResultTypeLabel}
        </span>
      )}
    </button>
  );
}

export default MemberChoiceItem;