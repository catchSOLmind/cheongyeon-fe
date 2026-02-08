// src/features/calendar/components/TaskList.tsx
import { useState } from 'react';
import type { MyTaskWeekItem } from '../types/task.types';
import TaskItem from './TaskItem';
import IconStar from '@/assets/calendar/icon-star.svg';

import EditBottomSheet from '@/features/calendar/components/EditBottomSheet';
import CalendarBottomSheet from '@/shared/components/CalendarBottomSheet';
import StatusChangeBottomSheet from '@/features/calendar/components/StatusChangeBottomSheet';
import ReasonChangeBottomSheet from './ReasonChangeBottomSheet';
import { updateMyTaskStatus } from '../api/taskApi';

type SheetType = 'edit' | 'calendar' | 'status' | 'reason' | null;

interface TaskListProps {
  task: MyTaskWeekItem[];
  isLoading?: boolean;
  selectedDate: Date;
  onTaskUpdate?: () => void; // refetch
  onCompleteTask: (occurrenceId: number) => Promise<void>; // ✅ 필수로 받자
}

export default function TaskList({
  task,
  isLoading,
  selectedDate,
  onTaskUpdate,
  onCompleteTask,
}: TaskListProps) {
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const [sheet, setSheet] = useState<SheetType>(null);
  const [selectedTask, setSelectedTask] = useState<MyTaskWeekItem | null>(null);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);

  // ✅ 깜빡임 제거용: 낙관적 완료 상태
  const [localCompletedIds, setLocalCompletedIds] = useState<Set<number>>(new Set());

  const formatDisplayDate = (date: Date): string => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return `${date.getMonth() + 1}월 ${date.getDate()}일${isToday ? ' 오늘' : ''}`;
  };

  const toggleLocalComplete = (occurrenceId: number) => {
  setLocalCompletedIds((prev) => {
    const next = new Set(prev);

    if (next.has(occurrenceId)) {
      next.delete(occurrenceId);
    } else {
      next.add(occurrenceId);
    }

    return next;
  });
};

  // ✅ 체크 클릭: API 딱 1번 + refetch 없음(깜빡임 제거)
  const handleToggleComplete = async (occurrenceId: number) => {
    if (pendingIds.has(occurrenceId)) return;

    toggleLocalComplete(occurrenceId); // UI 먼저
    setPendingIds((prev) => new Set(prev).add(occurrenceId));

    try {
      await onCompleteTask(occurrenceId); // ✅ 여기서만 API 호출
      // refetch 안 함 (필요하면 아주 나중에 조용히 동기화 가능)
      // setTimeout(() => onTaskUpdate?.(), 800);
    } catch (e) {
      // 실패 시 롤백
      toggleLocalComplete(occurrenceId);
      console.error(e);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(occurrenceId);
        return next;
      });
    }
  };

  const openEditSheet = (item: MyTaskWeekItem) => {
    setSelectedTask(item);
    setSheet('edit');
  };

  const closeAllSheets = () => setSheet(null);

  if (isLoading) {
    return <div className="px-5 py-4 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="px-5 py-4 bg-[#fafafa]">
      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-cta-m text-gray-900 px-2">{formatDisplayDate(selectedDate)}</h2>
        <button className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg text-body-m-bold">
          <img src={IconStar} alt="청연 지우개" className="w-5 h-5" />
          <span>청연 지우개</span>
        </button>
      </div>

      {/* 할 일 리스트 */}
      {task.length === 0 ? (
        <div className="flex flex-col items-center mt-20 text-gray-500">오늘 할 일이 없어요</div>
      ) : (
        <div className="space-y-3">
          {task.map((taskItem) => (
            <TaskItem
              key={taskItem.occurrenceId}
              task={taskItem}
              isLocallyCompleted={localCompletedIds.has(taskItem.occurrenceId)} // ✅ 전달
              onToggleComplete={() => handleToggleComplete(taskItem.occurrenceId)}
              onOpenBottomSheet={openEditSheet}
            />
          ))}
        </div>
      )}

      {/* ✏️ 편집 바텀시트 */}
      <EditBottomSheet
        open={sheet === 'edit'}
        onClose={closeAllSheets}
        task={selectedTask}
        onOpenDateChange={() => setSheet('calendar')}
        onOpenStatusChange={() => setSheet('status')}
      />

      {/* 📅 날짜 변경 바텀시트 (확정 시 refetch는 OK) */}
      <CalendarBottomSheet
        open={sheet === 'calendar'}
        onClose={closeAllSheets}
        value={pickedDate}
        year={pickedDate?.getFullYear() ?? selectedDate.getFullYear()}
        month={(pickedDate?.getMonth() ?? selectedDate.getMonth()) + 1}
        ctaLabel="변경하기"
        onConfirm={(date) => {
          if (!selectedTask) return;
          setPickedDate(date);
          console.log('날짜 변경 API', selectedTask.occurrenceId, date);

          onTaskUpdate?.(); // 확정 저장 느낌이라 refetch OK
          closeAllSheets();
        }}
      />

      {/* 🔄 상태 변경 바텀시트 (확인 시 1번만 API 호출, 완료 선택이면 complete 호출) */}
        <StatusChangeBottomSheet
          open={sheet === 'status'}
          onClose={closeAllSheets}
          initialStatus={selectedTask?.status ?? 'WAITING'}
          onConfirmStatus={async (status) => {
            if (!selectedTask) return;
            await updateMyTaskStatus(selectedTask.occurrenceId, { status });
            onTaskUpdate?.();
          }}
          onOpenIncompleteReason={() => setSheet('reason')}
        />

        <ReasonChangeBottomSheet
          open={sheet === 'reason'}
          onClose={closeAllSheets}
          onConfirm={async ({ reasonCode, reasonText }) => {
            if (!selectedTask) return;
            await updateMyTaskStatus(selectedTask.occurrenceId, {
              status: 'INCOMPLETED',
              reasonCode,
              reasonText,
            });
            onTaskUpdate?.();
            closeAllSheets();
          }}
        />

    </div>
  );
}
