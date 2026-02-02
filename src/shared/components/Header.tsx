import { useNavigate } from 'react-router-dom';
import IconLeft from '@/assets/navi/icon-left.svg';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
}


function Header({ 
  title = '', 
  showBackButton = false,
  onBackClick,
  backgroundColor = 'bg-white',
  textColor = 'text-gray-900',
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`sticky top-0 z-50 ${backgroundColor} border-b border-gray-200`}>
      <div className="flex items-center justify-between h-14 px-5">

        {/* 왼쪽 영역 */}
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={handleBackClick}
              className="p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <img
                src={IconLeft}
                className={`w-6 h-6 ${backgroundColor === 'bg-black' ? 'invert' : ''}`}
                alt="뒤로가기"
                />
            </button>
          )}
        </div>

        {/* 중앙 타이틀 */}
        <h1 className={`absolute left-1/2 -translate-x-1/2 text-body-l-bold ${textColor}`}>
          {title}
        </h1>

      </div>
    </header>
  );
}

export default Header;