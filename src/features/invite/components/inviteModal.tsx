import KakaoLinkIcon from "@/assets/invite/icon-kakao-share.svg";
import LinkIcon from "@/assets/invite/icon-link-share.svg";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKakaoInvite: () => void;
  onCopyLink: () => void;
}

/**
 * Render a centered invite modal offering KakaoTalk and link-copy share actions when visible.
 *
 * @param isOpen - Whether the modal is visible.
 * @param onClose - Callback invoked to close the modal (triggered from the backdrop and the close button).
 * @param onKakaoInvite - Callback invoked when the KakaoTalk invite button is clicked.
 * @param onCopyLink - Callback invoked when the link-copy button is clicked.
 * @returns A JSX element representing the invite modal, or `null` when `isOpen` is false.
 */
function InviteModal({ isOpen, onClose, onKakaoInvite, onCopyLink }: InviteModalProps) {
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
        {/* 제목 */}
        <div className="text-center mt-9">
          <h2 className="text-display-xs text-black">
            멤버를 초대하고<br />
            함께 우리집을 만들어가요
          </h2>
        </div>

        {/* 초대 방법 */}
        <div className="flex mt-7 justify-center gap-4">
          {/* 카카오톡 버튼 */}
          <button
            onClick={onKakaoInvite}
            className="flex flex-col items-center justify-center rounded-xl"
          >
            <img 
              src={KakaoLinkIcon} 
              alt="카카오톡을 통해 공유" 
              className="w-12 h-12 mb-2"
            />
            <span className="text-body-m text-black">카카오톡</span>
          </button>

          {/* 링크 복사 버튼 */}
          <button
            onClick={onCopyLink}
            className="flex flex-col items-center justify-center rounded-xl"
          >
            <img 
              src={LinkIcon} 
              alt="링크복사" 
              className="w-12 h-12 mb-2"
            />
            <span className="text-body-m text-black">링크 복사</span>
          </button>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="w-[251px] md:w-[calc(100%-46px)] md:max-w-[251px] h-[51px] rounded-lg bg-white border border-gray-300 text-body-l-bold text-gray-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;