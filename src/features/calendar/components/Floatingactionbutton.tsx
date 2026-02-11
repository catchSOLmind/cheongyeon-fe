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
  onClickEdit?: () => void;
}

function FloatingActionButton({
  showFeedback = true,
  showEdit = true,
  showAddTask = true,
  onClickEdit,
}: FloatingActionButtonProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  const handleAddTask = () => {
    setIsExpanded(false);
    navigate('/calendar/task');
  };

  const handleEdit = () => {
    setIsExpanded(false);
    onClickEdit?.();
  };

  const handleAddFeedback = () => {
    setIsExpanded(false);
    navigate('/calendar/feedback');
  };

  return (
    <>
      {/* 오버레이: 열렸을 때만 클릭 가능 + 클릭하면 닫기 */}
      <button
        type="button"
        aria-label="close fab overlay"
        onClick={() => setIsExpanded(false)}
        className={[
          'fixed inset-0 bg-black/40 z-[60] transition-opacity',
          isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* 플로팅 버튼 컨테이너 */}
      <div className="fixed bottom-20 right-5 z-[70] pointer-events-none md:max-w-[385px]">
        <div className="flex flex-col items-end gap-3">
          {/* 확장 메뉴: 열렸을 때만 pointer-events 활성화 */}
          <div
            className={[
              'flex flex-col gap-3 transition-all duration-300 origin-bottom',
              isExpanded
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-4 pointer-events-none',
            ].join(' ')}
          >
            {showFeedback && (
              <button
                type="button"
                onClick={handleAddFeedback}
                className="flex items-center bg-white gap-1 rounded-full shadow-lg hover:shadow-xl transition-all w-[127px] h-11 px-3"
              >
                <img src={IconFeedback} alt="피드백 남기기" className="w-5 h-5" />
                <span className="text-gray-800 text-body-m-bold whitespace-nowrap">피드백 남기기</span>
              </button>
            )}

            {showEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center bg-white gap-1 rounded-full shadow-lg hover:shadow-xl transition-all w-[127px] h-11 px-3"
              >
                <img src={IconAdd} alt="수정" className="w-5 h-5" />
                <span className="text-gray-800 text-body-m-bold whitespace-nowrap">수정하기</span>
              </button>
            )}

            {showAddTask && (
              <button
                type="button"
                onClick={handleAddTask}
                className="flex items-center bg-white gap-1 rounded-full shadow-lg hover:shadow-xl transition-all w-[127px] h-11 px-3"
              >
                <img src={IconPlusBlack} alt="할일 추가" className="w-5 h-5" />
                <span className="text-gray-800 text-body-m-bold whitespace-nowrap">할 일 추가하기</span>
              </button>
            )}
          </div>

          {/* 메인 플로팅 버튼은 항상 클릭 가능 */}
          <button
            type="button"
            onClick={handleToggle}
            className={[
              'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all pointer-events-auto',
              isExpanded ? 'bg-gray-900' : 'bg-primary',
            ].join(' ')}
            aria-label={isExpanded ? '닫기' : '할일 추가'}
          >
            {isExpanded ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <img src={IconPlus} alt="할일 추가" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default FloatingActionButton;