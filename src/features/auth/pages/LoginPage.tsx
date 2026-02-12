// import googleLogo from '@/assets/auth/logo-google.svg';
import kakaoLogo from '@/assets/auth/logo-kakao.svg';
import logoMain from '@/assets/auth/logo-cheongyeon-c.svg';

import { getKakaoLoginUrl } from '../utils/kakaoAuth';
import { useGuestLogin } from './useGuestLogin';


export default function LoginPage() {
  
  // 카카오 로그인 
  const handleClick = () => {
    window.location.href = getKakaoLoginUrl();
  };

  const { runGuestLogin } = useGuestLogin();


  return (
    <div className="min-h-dvh w-full bg-primary flex flex-col items-center">
      {/* 로고 */}
        <div className="mt-[12rem] mb-[13rem] flex justify-center">
        <img src={logoMain} alt="청연 로고" className="w-[134px]" />
      </div>

      {/* 버튼 */}
      <div className="pb-10 flex flex-col gap-3.5">
        {/* Kakao */}
        <button
          type="button"
          className="w-[217px] h-[51px] mx-auto rounded-full bg-[#FAE100]
                     text-black text-cta-m
                     flex items-center justify-center gap-2"
          onClick={handleClick}
        >
          <img src={kakaoLogo} alt="" className="w-4 h-4" />
          카카오로 빠른 로그인
        </button>

        {/* GUEST */}
        <button
            type="button"
            className="w-[217px] h-[51px] mx-auto rounded-full bg-white
                      text-black text-cta-m
                      flex items-center justify-center gap-2"
            onClick={runGuestLogin}  
          >
            게스트 로그인 
          </button>

        {/* Google */}
        {/* <button
          type="button"
          className="w-[217px] h-[51px] mx-auto rounded-full bg-white
                    text-black text-cta-m
                    flex items-center justify-center gap-2"
        >
          <img src={googleLogo} alt="" className="w-4 h-4" />
          Google로 로그인
        </button> */}
      </div>
    </div>
  );
}
