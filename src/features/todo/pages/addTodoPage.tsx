import { useState } from 'react';
import Header from '@/shared/components/Header';
import { TodoItem } from '../components/TodoItem';

interface Category {
  id: string;
  name: string;
  icon: string;
}

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

const categories: Category[] = [
  { id: 'favorite', name: '즐겨찾기', icon: '⭐' },
  { id: 'bathroom', name: '화장실', icon: '🚽' },
  { id: 'kitchen', name: '주방', icon: '🍽️' },
  { id: 'laundry', name: '빨래', icon: '🧺' },
  { id: 'bedroom', name: '침실', icon: '🛏️' },
  { id: 'living', name: '거실', icon: '🛋️' },
  { id: 'trash', name: '쓰레기', icon: '🗑️' },
  { id: 'other', name: '기타', icon: '➕' },
];

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // TODO: 선택된 카테고리에 따라 API 호출하여 할 일 목록 가져오기
  const todos = selectedCategory ? mockTodos : [];

  return (
    <div className="min-h-screen">
      <Header title="할 일 추가" showBackButton />
      
      <div className="px-5 py-6">
        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-4 gap-[6px] mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex flex-col items-center justify-center gap-2 p-3 rounded-lg
                transition-all
                ${
                  selectedCategory === category.id
                    ? 'bg-primary-50 border border-primary'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-[28px]">{category.icon}</span>
              <span className="text-label-m text-black">{category.name}</span>
            </button>
          ))}
        </div>

        {/* 나의 할 일 섹션 */}
        {selectedCategory && (
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
        )}
      </div>
    </div>
  );
}

export default AddTodoPage;
