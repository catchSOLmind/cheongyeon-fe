import iconInvite from "@/assets/invite/icon-invite.png";

interface InviteCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName?: string;
}

function InviteCompleteModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  // TODO: API 연결 후 실제 초대된 멤버 이름으로 변경
  memberName = "카카오톡 닉네임2"
}: InviteCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[20px] w-[297px] h-[299px] md:w-[calc(100%-40px)] md:max-w-[297px] md:max-h-[299px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti 아이콘 */}
        <div className="flex justify-center mt-12">
          <img 
            src={iconInvite} 
            alt="축하" 
            className="w-10 h-10"
          />
        </div>

        {/* 환영 메시지 */}
        <div className="text-center mt-3">
          <h2 className="text-display-xs text-black">
            {memberName}님<br />
            반가워요!
          </h2>
          <p className="text-body-s text-gray-800 mt-[14px]">
            이제 함께 집안일을 시작해볼까요?
          </p>
        </div>

        {/* 확인 버튼 */}
        <div className="flex justify-center mt-6 px-6">
          <button
            onClick={onConfirm}
            className="w-full h-[51px] rounded-lg bg-primary text-white text-body-l-bold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteCompleteModal;
