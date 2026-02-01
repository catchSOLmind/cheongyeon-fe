import IconCoin from '@/assets/todo/icon-coin.svg';
import IconCalendar from '@/assets/todo/icon-calendar.svg';
import IconClock from '@/assets/todo/icon-clock.svg';
import IconStar from '@/assets/todo/icon-star.svg';
import IconStarFill from '@/assets/todo/icon-star-fill.svg';

interface TodoItemProps {
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
  title,
  date,
  time,
  points,
  assignee,
  tag,
  isFavorite,
}: TodoItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 relative shadow-sm">
      {/* 제목 */}
      <h3 className="text-body-m-bold text-black pl-7">{title}</h3>

      {/* 날짜/시간 라인 (체크박스, 날짜/시간, 즐겨찾기 수평 정렬) */}
      <div className="flex items-center gap-3">
        {/* 체크박스 */}
        <div className="flex-shrink-0">
          <input type="checkbox" className="w-4 h-4" />
        </div>

        {/* 날짜와 시간 */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-1.5">
            <img src={IconCalendar} alt="날짜" className="w-5 h-5" />
            <span className="text-body-s text-gray-600">{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <img src={IconClock} alt="시간" className="w-5 h-5" />
            <span className="text-body-s text-gray-600">{time}</span>
          </div>
        </div>

        {/* 즐겨찾기 아이콘 */}
        <button className="flex-shrink-0">
          <img
            src={isFavorite ? IconStarFill : IconStar}
            alt="즐겨찾기"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* 포인트와 태그 */}
      <div className="flex items-center gap-3 pl-7">
        <div className="flex items-center gap-1.5">
          <img src={IconCoin} alt="포인트" className="w-5 h-5" />
          <span className="text-body-s text-gray-600">{points} 포인트</span>
        </div>
        <div className="flex items-center gap-2">
          {assignee.avatar && (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
              {assignee.avatar}
            </div>
          )}
          <span className="px-2 py-0.5 bg-primary-50 text-[#424B4C] rounded-full text-body-s">
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}
