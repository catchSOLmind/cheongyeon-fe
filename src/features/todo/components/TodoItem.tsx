import IconCoin from '@/assets/todo/icon-coin.svg';
import IconCalendar from '@/assets/todo/icon-calendar.svg';
import IconClock from '@/assets/todo/icon-clock.svg';
import IconStar from '@/assets/todo/icon-star.svg';
import IconStarFill from '@/assets/todo/icon-star-fill.svg';

import { categories } from '../data/categoryTypeImages';
import type { CategoryType } from '../types/category.types';

//사용자의 할일 아이템 조회
interface TodoItemProps {
  categoryType: CategoryType;
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

export function TodoItem({
  categoryType,
  title,
  date,
  time,
  points,
  assignee,
  tag,
  isFavorite,
}: TodoItemProps) {
  const category = categories.find((c) => c.categoryType === categoryType);
  const categoryIcon = category?.image;

  return (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center gap-3">
      {/* 카테고리 */}
      <div className="w-8 h-8 bg-primary-50 rounded-md flex items-center justify-center flex-shrink-0">
        {categoryIcon && (
          <img
            src={categoryIcon}
            alt={category?.name || '카테고리'}
            className="w-6 h-6"
          />
        )}
      </div>

      {/* 오른쪽: 내용 */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* 제목 */}
        <h3 className="text-body-m-bold text-black truncate">{title}</h3>

        {/* 날짜/시간 + 즐겨찾기 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-1.5">
              <img src={IconCalendar} alt="날짜" className="w-5 h-5" />
              <span className="text-body-s text-gray-600">{date}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <img src={IconClock} alt="시간" className="w-5 h-5" />
              <span className="text-body-s text-gray-600">{time}</span>
            </div>
          </div>

          <button className="flex-shrink-0">
            <img
              src={isFavorite ? IconStarFill : IconStar}
              alt="즐겨찾기"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* 포인트 + 태그 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <img src={IconCoin} alt="포인트" className="w-5 h-5" />
            <span className="text-body-s text-gray-600">{points} 포인트</span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            {assignee.avatar && (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                {assignee.avatar}
              </div>
            )}
            <span className="px-2 py-0.5 bg-primary-50 text-[#424B4C] rounded-full text-body-s whitespace-nowrap">
              {tag}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}