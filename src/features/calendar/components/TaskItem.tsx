import type { MyTaskWeekItem } from '../types/task.types';
import { useUserStore } from '@/features/auth/stores/useUserStore';

interface TaskItemProps {
  task: MyTaskWeekItem;
  isLocallyCompleted?: boolean;
  onToggleComplete?: () => void;
}

const formatTime = (time?: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}:${minutes}`;
};

function TaskItem({ task, isLocallyCompleted, onToggleComplete }: TaskItemProps) {
  const profile = useUserStore((state) => state.profile);

  const isCompleted = (isLocallyCompleted ?? false) || task.status === 'COMPLETED';
  const isMyTask = !!profile?.userId && profile.userId === task.primaryAssignedMemberId;

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl">
      {/* 체크박스 */}
      <button
        type="button"
        onClick={onToggleComplete}
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
          transition-colors
          ${isCompleted ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-300'}
        `}
        aria-label={isCompleted ? '완료 취소' : '완료'}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* 제목/시간 */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-body-m-bold text-black ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {task.taskName}
        </h3>

        {task.time && (
          <p className="text-body-s text-black mt-0.5">
            {formatTime(task.time)}
          </p>
        )}
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 이관 상태 */}
        {task.takeover && (
          <div className="px-3 py-1 bg-primary-50 text-primary-400 rounded-lg text-label-m">
            이관됨
          </div>
        )}

        {/* 내 할 일 표시(프로필) */}
        {isMyTask && profile && (
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt={profile.nickname} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">{profile.nickname?.charAt(0) || '?'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskItem;