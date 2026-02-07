import { useState } from 'react';
import type { MyTaskWeekItem } from '../types/task.types'; 
import TaskItem from './TaskItem';
import IconStar from '@/assets/calendar/icon-star.svg';
import { postMyTasks } from '../api/taskApi';

interface TaskListProps {
  task: MyTaskWeekItem[];
  isLoading?: boolean;
  selectedDate: Date;
  onTaskUpdate?: () => void;
}

function TaskList({ task, isLoading, selectedDate }: TaskListProps) {
  const [localCompletedIds, setLocalCompletedIds] = useState<Set<number>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set()); // 중복 클릭 방지

  // 날짜 포맷팅
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

  // 완료 토글 (로컬 반영)
  const toggleLocalComplete = (occurrenceId: number) => {
    // 현재 occurrenceId 존재 시 다음 occurrenceId 삭제 
    setLocalCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(occurrenceId)) next.delete(occurrenceId);
      else next.add(occurrenceId);
      return next;
      });
  };

  const handleToggleComplete = async (occurrenceId: number) => {
    // 중복 요청 방지 - 이미 요청중이면 무시 
    if (pendingIds.has(occurrenceId)) return;

    // UI 먼저 반영
    toggleLocalComplete(occurrenceId);
    setPendingIds((prev)=> new Set(prev).add(occurrenceId));

    // 서버 반영
    try {
      await postMyTasks(occurrenceId);
    }
    catch{
      // 서버 반영 실패시 UI 적용 취소
      toggleLocalComplete(occurrenceId);
    }
    finally{
      // penging 제거 
      setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(occurrenceId);
      return next;
    });
    }
  };

  if (isLoading) {
    return (
      <div className="px-5 py-4">
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 bg-[#fafafa]">
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
      {!task || task.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-center mt-20 text-black text-display-xs">
            오늘 할 일이 없어요
          </span>
          <span className="text-center text-gray-500 mb-20">
            할 일을 추가하고 일정을 계획해보세요
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {task.map((taskItem) => (
            <TaskItem 
              key={taskItem.occurrenceId}
              task={taskItem}
              isLocallyCompleted={localCompletedIds.has(taskItem.occurrenceId)}
              onToggleComplete={() => handleToggleComplete(taskItem.occurrenceId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;