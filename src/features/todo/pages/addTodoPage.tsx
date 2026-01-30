import { useState } from 'react';
import Header from '@/shared/components/Header';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TodoItem {
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

// 목업 데이터
// 여기 가사 카테코리를 클릭했을 때 조회 되는 데이터 리스트 API 를 추가해야 함
const mockTodos: TodoItem[] = [
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
                    ? 'bg-primary text-white'
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
        <div className="mb-6">
          <h2 className="text-label-m text-gray-500 mb-4">나의 할 일</h2>
          
          {/* 할 일 목록 */}
          {mockTodos.length > 0 ? (
            <div className="flex flex-col gap-3">
              {mockTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 relative shadow-sm"
                >
                  {/* 체크박스 */}
                  <div
                    className={`
                      w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5
                      ${todo.isCompleted ? 'bg-primary' : 'bg-blue-100'}
                    `}
                  >
                    {todo.isCompleted && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    {/* 제목 */}
                    <h3 className="text-body-l-bold text-gray-900 mb-2">{todo.title}</h3>

                    {/* 날짜와 시간 */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-body-m text-gray-700">{todo.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-body-m text-gray-700">{todo.time}</span>
                      </div>
                    </div>

                    {/* 포인트와 태그 */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🪙</span>
                        <span className="text-body-m text-gray-700">{todo.points} 포인트</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {todo.assignee.avatar && (
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                            {todo.assignee.avatar}
                          </div>
                        )}
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-body-s">
                          {todo.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 즐겨찾기 아이콘 */}
                  {todo.isFavorite && (
                    <button className="absolute top-4 right-4 flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
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
    </div>
  );
}

export default AddTodoPage;
