// src/features/calendar/components/TaskList.tsx
import { useEffect, useState } from 'react';
import type { MyTaskWeekItem } from '../types/task.types';
import TaskItem from './TaskItem';
import IconStar from '@/assets/calendar/icon-star.svg';

import EditBottomSheet from '@/features/calendar/components/EditBottomSheet';
import StatusChangeBottomSheet from '@/features/calendar/components/StatusChangeBottomSheet';
import ReasonChangeBottomSheet from './ReasonChangeBottomSheet';
import { requestMyTaskAssignee, updateMyTaskStatus } from '../api/myTaskEditApi';
import RescheduleFlowBottomSheet from './RescheduleBottomSheet';
import EditAllFlowBottomSheet from '@/shared/components/EditAllBottomsheet';
import EraserAnalyzePopup from '@/features/eraser/components/EraserAnalyzePopup';
import AssigneeBottomSheet from '@/shared/group/AssigneeBottomSheet';
import type { GroupMember } from '@/shared/group/groupMembers.types';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import { getGroupMembers } from '@/shared/group/groupMemberApi';

type SheetType = 'edit' | 'calendar' | 'status' | 'reason' | 'allEdit' | 'member' | null;

interface TaskListProps {
  task: MyTaskWeekItem[];
  isLoading?: boolean;
  selectedDate: Date;
  onTaskUpdate?: () => void; // refetch
  onCompleteTask: (occurrenceId: number) => Promise<void>;

  /** 편집모드/삭제 */
  isEditMode?: boolean;
  onExitEditMode?: () => void;
  onDeleteTask?: (occurrenceId: number) => Promise<void> | void;
}

export default function TaskList({
  task,
  isLoading,
  selectedDate,
  onTaskUpdate,
  onCompleteTask,
  isEditMode = false,
  onExitEditMode,
  onDeleteTask,
}: TaskListProps) {
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [sheet, setSheet] = useState<SheetType>(null);
  const [selectedTask, setSelectedTask] = useState<MyTaskWeekItem | null>(null);
  const [pickedDate] = useState<Date | null>(null);
  const [openEraserPopup, setOpenEraserPopup] = useState(false);

  // 멤버
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [, setMembersLoading] = useState(false);

  const groupId = useUserStore((s) => s.profile?.groupId ?? null);

  useEffect(() => {
    if (sheet !== 'member') return;

    const run = async () => {
      try {
        setMembersLoading(true);

        if (!groupId) return;
        const res = await getGroupMembers(groupId);
        setMembers(res.result.members);
      } finally {
        setMembersLoading(false);
      }
    };

    run();
  }, [sheet, groupId]);

  // 깜빡임 제거용: 낙관적 완료 상태
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

  // 체크 클릭: API 딱 1번 + refetch 없음(깜빡임 제거)
  const handleToggleComplete = async (occurrenceId: number) => {
    if (pendingIds.has(occurrenceId)) return;

    toggleLocalComplete(occurrenceId);
    setPendingIds((prev) => new Set(prev).add(occurrenceId));

    try {
      await onCompleteTask(occurrenceId);
    } catch (e) {
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
    // 편집모드일 땐 바텀시트 열지 않기
    if (isEditMode) return;

    setSelectedTask(item);
    setSheet('edit');
  };

  const closeAllSheets = () => setSheet(null);

  if (isLoading) {
    return <div className="px-5 py-4 text-center text-gray-500">로딩 중...</div>;
  }

  return (
     <div className="px-5 py-4 bg-[#fafafa] relative">

        {/* 편집모드 종료용 오버레이 */}
        {isEditMode ? (
          <button
            type="button"
            aria-label="exit edit mode"
            onClick={() => onExitEditMode?.()}
            className="absolute inset-0 z-[5] bg-transparent"
          />
        ) : null}

      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-cta-m text-gray-900 px-2">{formatDisplayDate(selectedDate)}</h2>

        <button
          onClick={() => setOpenEraserPopup(true)}
          className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg text-body-m-bold"
        >
          <img src={IconStar} alt="청연 지우개" className="w-5 h-5" />
          <span>청연 지우개</span>
        </button>

        <EraserAnalyzePopup open={openEraserPopup} onClose={() => setOpenEraserPopup(false)} />
      </div>

      {/* 할 일 리스트 */}
      {task.length === 0 ? (
        <div className="flex flex-col items-center mt-20 text-gray-500">오늘 할 일이 없어요</div>
      ) : (
        <div className="space-y-3">
          {task.map((taskItem) => (
            <div key={taskItem.occurrenceId} className="relative">
              {/* 편집모드일 때만 빨간 삭제 버튼 */}
              {isEditMode ? (
                <button
                  type="button"
                  aria-label="delete task"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask?.(taskItem.occurrenceId);
                  }}
                  className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-red-500 shadow flex items-center justify-center"
                >
                  <span className="text-white text-[16px] leading-none">−</span>
                </button>
              ) : null}

              <TaskItem
                task={taskItem}
                isLocallyCompleted={localCompletedIds.has(taskItem.occurrenceId)}
                onToggleComplete={() => handleToggleComplete(taskItem.occurrenceId)}
                onOpenBottomSheet={openEditSheet}
              />
            </div>
          ))}
        </div>
      )}

      {/* 편집 바텀시트 (부모 바텀시트) */}
      <EditBottomSheet
        open={sheet === 'edit'}
        onClose={closeAllSheets}
        task={selectedTask}
        onOpenDateChange={() => setSheet('calendar')}
        onOpenStatusChange={() => setSheet('status')}
        onOpenAllChange={() => setSheet('allEdit')}
        onOpenAssignChange={() => setSheet('member')}
        onDeleted={() => {
          onTaskUpdate?.();
          closeAllSheets();
        }}
      />

      {/* 상태 변경 바텀시트 */}
      <StatusChangeBottomSheet
        open={sheet === 'status'}
        task={selectedTask}
        initialStatus={selectedTask?.status ?? 'WAITING'}
        onConfirmStatus={async (status) => {
          if (!selectedTask) return;
          await updateMyTaskStatus(selectedTask.occurrenceId, { status });
          onTaskUpdate?.();
        }}
        onOpenIncompleteReason={() => setSheet('reason')}
        onClose={closeAllSheets}
      />

      {/* 날짜 변경 바텀시트 */}
      <RescheduleFlowBottomSheet
        open={sheet === 'calendar'}
        initialDate={selectedDate}
        task={selectedTask}
        onUpdated={() => {
          onTaskUpdate?.();
          closeAllSheets();
        }}
        onClose={closeAllSheets}
      />

      <ReasonChangeBottomSheet
        open={sheet === 'reason'}
        onClose={closeAllSheets}
        task={selectedTask}
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

      {/* 전체 수정 바텀시트 */}
      <EditAllFlowBottomSheet
        open={sheet === 'allEdit'}
        onClose={closeAllSheets}
        task={selectedTask}
        initialDate={pickedDate}
      />

      <AssigneeBottomSheet
        open={sheet === 'member'}
        onClose={closeAllSheets}
        members={members}
        selectedId={selectedTask?.primaryAssignedMemberId ?? null}
        onConfirm={async (member) => {
          if (!selectedTask) return;

          await requestMyTaskAssignee(selectedTask.occurrenceId, {
            toMemberId: member.memberId,
          });

          onTaskUpdate?.();
          closeAllSheets();
        }}
      />
    </div>
  );
}
