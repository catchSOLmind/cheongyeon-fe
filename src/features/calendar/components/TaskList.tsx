import type { TaskItem as TaskItemType } from '../types/task.types'; 
import TaskItemComponent from './TaskItem';  // ✅ 이대로 유지
import IconStar from '@/assets/calendar/icon-star.svg';

interface TaskListProps {
  tasks: TaskItemType[];
  isLoading?: boolean;
  selectedDate: Date;
  onTaskUpdate?: () => void;
}

function TaskList({ tasks, isLoading, selectedDate, onTaskUpdate }: TaskListProps) {
  // 날짜 포맷팅 (예: "1월 1일 오늘")
  const formatDisplayDate = (date: Date): string => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일${isToday ? ' 오늘' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="px-5 py-4">
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 bg-[#fafafa] min-h-screen">
      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-cta-m text-gray-900 px-2">
          {formatDisplayDate(selectedDate)}
        </h2>
        <button className="flex items-center gap-1 px-2 py-1 bg-primary-50 text-semantic-badge rounded-lg text-body-m-bold">
          <img src={IconStar} alt="청연 지우개" className="w-5 h-5" />
          <span>청연 지우개</span>
        </button>
      </div>

      {/* 할일 리스트 */}
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          오늘 할 일이 없습니다
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItemComponent key={task.occurrenceId} task={task} onUpdate={onTaskUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;