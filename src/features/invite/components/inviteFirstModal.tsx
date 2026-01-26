import logoKakao from "@/assets/auth/logo-kakao.svg";
import logoGoogle from "@/assets/auth/logo-google.svg";

interface InviteFirstModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKakaoLogin: () => void;
  onGoogleLogin: () => void;
  inviterName?: string;
  inviterImageUrl?: string;
}

function InviteFirstModal({ 
  isOpen, 
  onClose, 
  onKakaoLogin, 
  onGoogleLogin,
  // TODO: API 연결 후 실제 초대한 사람 정보로 변경
  inviterName = "카카오톡 닉네임1",
  inviterImageUrl 
}: InviteFirstModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[20px] w-[297px] h-[446px] md:w-[calc(100%-40px)] md:max-w-[297px] md:max-h-[446px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <div className="text-center mt-9">
          <h2 className="text-display-xs text-black">
            초대받으신 것을 환영해요!
            <br />
            함께 우리집을 만들어가요
          </h2>
          <p className="text-body-s text-gray-800 mt-2">
            로그인하고 멤버가 되어주세요!
          </p>
        </div>

        {/* 초대한 사람 */}
        <div className="bg-gray-100 mt-8 mx-[32px] py-3 px-[32px] rounded-xl">
          <p className="text-body-s text-black mb-2">초대한 사람</p>
          <div className="flex items-center gap-3">
            {inviterImageUrl ? (
              <img 
                src={inviterImageUrl} 
                alt={inviterName}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            )}
            <span className="text-body-m-bold text-black">{inviterName}</span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-4 mx-[32px] mt-8">
          {/* Kakao */}
          <button
            type="button"
            onClick={onKakaoLogin}
            className="w-full h-[51px] rounded-full bg-[#FAE100] text-black text-cta-m flex items-center justify-center gap-2"
          >
            <img src={logoKakao} alt="카카오" className="w-4 h-4" />
            카카오로 빠른 로그인
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={onGoogleLogin}
            className="w-full h-[51px] rounded-full bg-gray-100 text-black text-cta-m flex items-center justify-center gap-2"
          >
            <img src={logoGoogle} alt="Google" className="w-4 h-4" />
            Google로 로그인
          </button>
        </div>
    

        {/* 약관 동의 문구 */}
        <div className="mt-4 px-6">
          <p className="text-label-caption text-gray-600 text-center">
            계속 진행하시면 <span className="underline">이용약관</span> 및 <span className="underline">개인정보처리방침</span>에<br />
            동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InviteFirstModal;
