import { useState } from 'react';
import Header from '@/shared/components/Header';
import { TodoItem } from '../components/TodoItem';
import AddTodoBottomSheet from '../components/add/AddTodoBottomSheet';
import type { CategoryType } from '../types/category.types';
import { categories } from '../data/categoryTypeImages';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';

import { useTaskDraftStore } from '../stores/useTaskDraftStore';
import { useMemo } from 'react';

import type { DraftTaskItemData } from '../types/draftTask.types';

import { addMyTasks } from '../api/myWorkApi';
import { useNavigate } from 'react-router-dom';


function AddTodoPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryType: CategoryType | '') => {
    if (!categoryType) {
      // 즐겨찾기 처리
      return;
    }
    setSelectedCategory(categoryType);
    setIsBottomSheetOpen(true);
  };


  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setSelectedCategory(null);
  };

  const drafts = useTaskDraftStore((s) => s.drafts);
  const clearDrafts = useTaskDraftStore((s) => s.clear);

  const todos: DraftTaskItemData[] = useMemo(() => {
  return drafts.map((draft) => ({
    id: draft.draftId,
    categoryType: draft.categoryType,      
    title: draft.taskName,
    date: draft.date,
    time: draft.time,
    points: draft.point,

    assignee: {
      name: draft.assigneeName ?? '미지정',
    },

    tag:
      draft.weekday !== undefined
        ? ['일', '월', '화', '수', '목', '금', '토'][draft.weekday]
        : '',

    isFavorite: draft.isFavorite,
    isCompleted: false,
  }));
}, [drafts]);


  const handleSubmitToCalendar = async () => {
    if (drafts.length === 0) return;

    // date 정책: 일단 "첫 draft의 date"로 통일 (또는 선택한 날짜로 통일)
    const date = drafts[0].date;

    // 여러 개 taskTypeId 모아서 보내기
    const taskTypeIds = drafts.map((d) => d.taskTypeId);

    try {
      const res = await addMyTasks({ date, taskTypeIds });

      // 성공 처리: draft 비우고, 이전 화면으로 이동 등
      clearDrafts();
      navigate('/calendar');
      console.log('추가 성공:', res.createdCount);
    } catch (e) {
      console.error('추가 실패:', e);
      alert('캘린더 추가에 실패했어요. 다시 시도해주세요.');
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <Header title="할 일 추가" showBackButton />
      
    
        <div className="px-5 py-6 pb-16">
        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-4 gap-[6px] mb-6">
          {categories.map((category) => (
            <button
              key={category.categoryType || 'favorite'}
              onClick={() => handleCategoryClick(category.categoryType)}
              className={`
                flex flex-col items-center justify-center gap-2 p-3 rounded-lg
                transition-all
                ${
                  selectedCategory === category.categoryType  
                    ? 'bg-primary-50 border border-primary'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }
              `}
            >
              <img src={category.image} alt={category.name} className="w-8 h-11" />
              <span className="text-label-m text-black">{category.name}</span>
            </button>
          ))}
        </div>


        {/* 나의 할 일 섹션 - 상시 표시 */}
        <div className="mb-6">
          <h2 className="text-label-m text-gray-500 mb-4">나의 할 일</h2>
            {/* 할 일 목록 */}
              {todos.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      {...todo}
                    />
                  ))}
                </div>
          ) : (
            /* 빈 상태 메시지 */
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-display-xs text-black mb-2">추가된 할 일이 없어요</p>
              <p className="text-body-m-regular text-gray-600">할 일을 추가하고 일정을 계획해보세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 바텀시트 */}
      {isBottomSheetOpen && selectedCategory && (
        <AddTodoBottomSheet
          categoryType={selectedCategory}
          name={categories.find((c) => c.categoryType === selectedCategory)?.name || ''}
          isOpen={isBottomSheetOpen}
          onClose={handleCloseBottomSheet}
        />
      )}

      <BottomCTAWrapper fixed showTopBorder>
      <BottomCTAButton
        label="캘린더에 추가하기"
        disabled={drafts.length === 0}
        onClick={handleSubmitToCalendar}
      />
    </BottomCTAWrapper>
    </div>
  );
}

export default AddTodoPage;
