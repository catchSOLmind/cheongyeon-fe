import { useState } from 'react';
import Header from '@/shared/components/Header';
import { TodoItem } from '../components/TodoItem';
import AddTodoBottomSheet from '../components/add/AddTodoBottomSheet';
import type { CategoryType } from '../types/category.types';
import { categories } from '../data/categoryTypeImages';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';

interface TodoItemData {
  id: string;
  title: string;
  date: string;
  time: string;
  points: number;
  assignee: {
    name: string;
    avatar?: string;
  };
  tag: string;
  isFavorite: boolean;
  isCompleted: boolean;
}

// 목업 데이터 - TODO: API 연동 후 제거
const mockTodos: TodoItemData[] = [
  {
    id: '1',
    title: '창틀 청소',
    date: '1월 21일 (금)',
    time: '오전 11:00',
    points: 30,
    assignee: {
      name: '금',
      avatar: '🐕',
    },
    tag: '금',
    isFavorite: true,
    isCompleted: false,
  },
];

function AddTodoPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 나의 할 일은 항상 표시 (상시 띄워놓기)
  const todos = mockTodos;

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

  return (
    <div className='h-screen flex flex-col'>
      <Header title="할 일 추가" showBackButton />
      
    
        <div className="px-5 py-6">
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
                  id={todo.id}
                  title={todo.title}
                  date={todo.date}
                  time={todo.time}
                  points={todo.points}
                  assignee={todo.assignee}
                  tag={todo.tag}
                  isFavorite={todo.isFavorite}
                  isCompleted={todo.isCompleted}
                />
              ))}
            </div>
          ) : (
            /* 빈 상태 메시지 */
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-display-xs text-black mb-2">오늘 할 일이 없어요</p>
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
        <BottomCTAButton label='캘린더에 추가하기'/>
      </BottomCTAWrapper>
    </div>
  );
}

export default AddTodoPage;
