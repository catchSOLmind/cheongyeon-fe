import { useState } from 'react';
import type { Task } from '../utils/taskAdapter';
import { updateTaskStatus } from '../api/taskApi';
import { useUserStore } from '@/features/auth/stores/useUserStore';

interface TaskItemProps {
  task: Task;
  onUpdate?: () => void;
}

// 시간 포맷팅 (HH:mm -> 오전/오후 HH:mm)
const formatTime = (time?: string | null): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${period} ${displayHour}:${minutes}`;
};

// 날짜 시간 포맷팅 (YYYY-MM-DD HH:mm:ss)
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 개별 할일 아이템 컴포넌트
function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const user = useUserStore((state) => state.user);

  const handleToggleComplete = async () => {
    if (!user?.id) {
      console.error('사용자 정보가 없습니다');
      return;
    }

    setIsUpdating(true);
    try {
      const now = new Date();
      const newStatus = task.completed ? 'UNCOMPLETED' : 'COMPLETED';
      
      await updateTaskStatus({
        occurrenceId: task.occurrenceId,
        status: newStatus,
        doneByMemberId: user.id,
        doneAt: formatDateTime(now),
        updatedAt: formatDateTime(now),
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('할일 업데이트 실패:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl">
      {/* 왼쪽: 체크박스 */}
      <button
        onClick={handleToggleComplete}
        disabled={isUpdating}
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
          transition-colors
          ${
            task.completed
              ? 'bg-primary border-primary'
              : 'bg-gray-100 border-gray-300'
          }
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={task.completed ? '완료 취소' : '완료'}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
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
      </button>

      {/* 중앙: 제목과 시간 */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
            text-body-m-bold text-black
            ${task.completed ? 'line-through text-gray-400' : ''}
          `}
        >
          {task.title}
        </h3>
        {task.time && (
          <p className="text-body-s text-black mt-0.5">
            {formatTime(task.time)}
          </p>
        )}
      </div>

      {/* 오른쪽: 상태 버튼과 프로필 */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 상태 버튼 */}
        {task.status && (
          <button
            className="px-3 py-1 bg-primary-50 text-primary-400  rounded-lg text-label-m "
            disabled
          >
            {task.status}
          </button>
        )}
        
        {/* 프로필 이미지 */}
        {task.assignedTo && (
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            {task.assignedTo.imageUrl ? (
              <img
                src={task.assignedTo.imageUrl}
                alt={task.assignedTo.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
