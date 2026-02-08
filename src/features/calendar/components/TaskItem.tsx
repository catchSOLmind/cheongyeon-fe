// src/features/calendar/components/TaskItem.tsx
import type { MyTaskWeekItem, TaskStatus } from '../types/task.types';
import { categories } from '@/features/todo/data/categoryTypeImages';
import IconCoin from '@/assets/todo/icon-coin.svg';
import IconCheckFill from '@/assets/calendar/img-check-fill.svg';
import IconCheck from '@/assets/calendar/img-check.svg';

interface TaskItemProps {
  task: MyTaskWeekItem;
  isLocallyCompleted?: boolean;
  onToggleComplete?: () => void;
  onOpenBottomSheet?: (task: MyTaskWeekItem) => void;
}

const formatTime = (time?: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}:${minutes}`;
};

const getStatus = (status: TaskStatus) => {
  const label =
    status === 'WAITING'
      ? '대기중'
      : status === 'IN_PROGRESS'
        ? '진행중'
        : status === 'COMPLETED'
          ? '완료'
          : '미완료';

  const className =
    status === 'WAITING'
      ? 'bg-primary-50 text-primary-400'
      : status === 'IN_PROGRESS'
        ? 'bg-primary-50 text-primary-400'
        : status === 'COMPLETED'
          ? 'bg-primary text-white'
          : 'bg-primary-50 text-primary-400';

  return { label, className };
};

export default function TaskItem({
  task,
  isLocallyCompleted,
  onToggleComplete,
  onOpenBottomSheet,
}: TaskItemProps) {
  const isCompleted = (isLocallyCompleted ?? false) || task.status === 'COMPLETED';

  const handleCardClick = () => {
    onOpenBottomSheet?.(task);
  };

  const category = categories.find((c) => c.categoryType === task.category);
  const categoryIcon = category?.image;

  const effectiveStatus: TaskStatus = isCompleted ? 'COMPLETED' : task.status;
  const { label: statusLabel, className: statusClassName } = getStatus(effectiveStatus);

  return (
    <div
      className="w-full rounded-xl bg-white p-4"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        {/* 카테고리 아이콘 */}
        <div className="w-8 h-8 rounded-lg bg-[#FAE0F8] flex items-center justify-center">
          {categoryIcon ? (
            <img src={categoryIcon} alt={category?.name ?? '카테고리'} className="w-8 h-8" />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-200" />
          )}
        </div>

        {/* 제목 + 서브라인(시간 | 포인트) */}
        <div className="flex-1 min-w-0">
          <div className="text-body-m-bold text-black">{task.taskName}</div>

          <div className="mt-1 flex items-center gap-2 text-body-m text-gray-700">
            {!!task.time && <span>{formatTime(task.time)}</span>}

            {!!task.time && (
              <span className="text-gray-300" aria-hidden>
                |
              </span>
            )}

            <div className="flex items-center gap-1">
              <img src={IconCoin} alt="포인트" className="w-4 h-4" />
              <span className="text-body-s text-black">{task.point} 포인트</span>
            </div>
          </div>
        </div>

        {/* 상태 + 체크 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={['px-3 py-1 rounded-lg text-body-m-bold', statusClassName].join(' ')}>
            {statusLabel}
          </div>

          <img
            src={isCompleted ? IconCheckFill : IconCheck}
            alt={isCompleted ? '완료' : '미완료'}
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 방지
              onToggleComplete?.();
            }}
            className="w-8 h-8"
          />
        </div>
      </div>
    </div>
  );
}
