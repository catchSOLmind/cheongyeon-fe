import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconPlus from '@/assets/calendar/icon-plus.svg';
import IconPlusBlack from '@/assets/calendar/icon-plus-black.svg';
import IconAdd from '@/assets/calendar/icon-add.svg';
import IconFeedback from '@/assets/calendar/icon-feedback.svg';

interface FloatingActionButtonProps {
  showFeedback?: boolean;
  showEdit?: boolean;
  showAddTask?: boolean;
}

function FloatingActionButton({ 
  showFeedback = true,
  showEdit = true,
  showAddTask = true,
}: FloatingActionButtonProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleAddTask = () => {
    setIsExpanded(false);
    navigate('/calendar/task');
  };

  const handleEdit = () => {
    setIsExpanded(false);
    navigate('/calendar/edit');
  };

  const handleAddFeedback = () => {
    setIsExpanded(false);
    navigate('/calendar/feedback');
  };

  return (
    <>
      {/* 배경 오버레이 (확장 시에만 표시) */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[60] transition-opacity"
          onClick={handleToggle}
        />
      )}

      {/* 플로팅 버튼 컨테이너 */}
      <div className="fixed bottom-20 right-5 z-[70] flex flex-col items-end gap-3">
        {/* 확장 메뉴 */}
        <div
          className={`
            flex flex-col gap-3 transition-all duration-300 origin-bottom
            ${
              isExpanded
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            }
          `}
        >

         {/* 피드백 남기기 */}
         {showFeedback && (
           <button
             onClick={handleAddFeedback}
             className="flex items-center bg-white gap-1 rounded-full shadow-lg hover:shadow-xl transition-all group w-[127px] h-11 px-3"
           >
             <img src={IconFeedback} alt="피드백 남기기" className="w-5 h-5" />
             <span className="text-gray-800 text-body-m-bold whitespace-nowrap">피드백 남기기</span>
           </button>
         )}

        {/* 수정하기 */}
        {showEdit && (
          <button
            onClick={handleEdit}
            className="flex items-center bg-white gap-1 rounded-full shadow-lg hover:shadow-xl transition-all group w-[127px] h-11 px-3"
          >
            <img src={IconAdd} alt="수정" className="w-5 h-5" />
            <span className="text-gray-800 text-body-m-bold whitespace-nowrap">수정하기</span>
          </button>
        )}

          {/* 할 일 추가하기 */}
          {showAddTask && (
            <button
              onClick={handleAddTask}
              className="flex items-center bg-white gap-1 rounded-full shadow-lg hover:shadow-xl transition-all group w-[127px] h-11 px-3"
            >
              <img src={IconPlusBlack} alt="할일 추가" className="w-5 h-5" />
              <span className="text-gray-800 text-body-m-bold whitespace-nowrap">할 일 추가하기</span>
            </button>
          )}
        </div>

        {/* 메인 플로팅 버튼 */}
        <button
          onClick={handleToggle}
          className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all
            ${
              isExpanded
                ? 'bg-gray-900'
                : 'bg-primary'
            }
          `}
          aria-label={isExpanded ? '닫기' : '할일 추가'}
        >
          {isExpanded ? (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <img src={IconPlus} alt="할일 추가" className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  );
}

export default FloatingActionButton;