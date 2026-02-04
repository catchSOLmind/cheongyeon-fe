import cheongyeonLogo from '@/assets/calendar/logo-cheongyeon-black.svg';
import IconBell from '@/assets/calendar/icon-bell.svg';
import IconPaper from '@/assets/calendar/icon-paper.svg';
import MyworkPage from './MyworkPage';
import AllworkPage from './AllworkPage';
import useSlideIndicator from '../hooks/useSlideIndicator';

function CalendarPage() {
  const { activeTab, indicatorStyle, myTabRef, allTabRef, handleTabClick } = useSlideIndicator('my');

  return (
    <div className="bg-white">
      {/* 상단 헤더 */}
      <div className="bg-white sticky top-0 z-50 ">
        <div className="flex items-center justify-between h-14 px-5">
          <div className="flex items-center gap-1">
            <img src={cheongyeonLogo} alt="청연 로고" className="w-6 h-6" />
            <h1 className="text-price-l font-medium text-black">우리집</h1>
          </div>

          {/* 상단 아이콘 */}
          <div className="flex gap-5">
            <img src={IconPaper} alt="문서" className="w-6 h-6" />
            <img src={IconBell} alt="알림" className="w-6 h-6" />
          </div>
        </div>

        {/* 탭 */}
        <div className="relative flex gap-[1.375rem] px-5 pb-0.5">
          <button
            ref={myTabRef}
            onClick={() => handleTabClick('my')}
            className={`py-0.5 text-display-xs ${
              activeTab === 'my' ? 'text-black' : 'text-gray-400'
            }`}
          >
            내 할 일
          </button>
          <button
            ref={allTabRef}
            onClick={() => handleTabClick('all')}
            className={`py-0.5 text-display-xs ${
              activeTab === 'all' ? 'text-black' : 'text-gray-400'
            }`}
          >
            전체 할 일
          </button>

          {/* 슬라이드 인디케이터 */}
          <div
            className="absolute bottom-0 h-0.5 bg-black transition-all duration-300 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
        <div className="px-5 py-4 bg-white">
          {/* 공지사항 카드 */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg shadow-sm">
            <span className="px-2 py-1 bg-secondary-500 text-white rounded text-[10px] font-medium font-caption whitespace-nowrap">
              공지
            </span>
            <p className="text-label-l text-gray-800 flex-1">
              이번 주에 집들이 예정 손님용 화장실 먼저
            </p>
          </div>
        </div>
        
      </div>

      {/* 탭에 따른 페이지 렌더링 */}
      {activeTab === 'my' ? <MyworkPage /> : <AllworkPage />}
    </div>
  );
}

export default CalendarPage;