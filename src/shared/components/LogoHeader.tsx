
import { useNavigate } from 'react-router-dom';
import cheongyeonLogo from '@/assets/calendar/logo-cheongyeon-black.svg';
import IconLeft from '@/assets/navi/icon-left.svg';

interface AppHeaderProps {
  title?: string;
  className?: string;
}

// 헤더에 로고가 있는 버전 , 누르면 홈화면으로 이동한다
export default function AppHeader({ title = '우리집', className = '' }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={`bg-white sticky top-0 z-50 ${className}`}>
      <div className="relative flex items-center justify-center h-14 px-5 border-b">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 top-1/2 -translate-y-1/2"
          aria-label="뒤로가기"
        >
          <img src={IconLeft} className="w-6 h-6" alt="뒤로가기" />
        </button>
        {/* 가운데: 로고 + 텍스트 */}
        <button
          type="button"
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-1"
          aria-label="캘린더로 이동"
        >
            {/* 산돌폰트*/}
          <img src={cheongyeonLogo} alt="청연 로고" className="w-4 h-4" />
          <h1 className="text-[16px] font-medium text-black">{title}</h1>
        </button>
      </div>
    </div>
  );
}
