import { useEffect, useState } from 'react';
import type { GroupTaskWeekItem } from '../types/groupTask.types'; 
import GroupTaskTaskItem from './GroupTaskItem';
import IconStar from '@/assets/calendar/icon-star.svg';
import EditBottomSheet from './EditBottomSheet';
import StatusChangeBottomSheet from './StatusChangeBottomSheet';
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

interface GroupTaskListProps {
  task: GroupTaskWeekItem[];
  isLoading?: boolean;
  selectedDate: Date;
  onTaskUpdate?: () => void;
}

function GroupTaskList({ task, isLoading, selectedDate, onTaskUpdate, }: GroupTaskListProps) {
  const [sheet, setSheet] = useState<SheetType>(null);
  const [selectedTask, setSelectedTask] = useState<GroupTaskWeekItem | null>(null);
  const [pickedDate,] = useState<Date | null>(null);
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

  const openEditSheet = (item: GroupTaskWeekItem) => {
    setSelectedTask(item);
    setSheet('edit');
  };

  const closeAllSheets = () => setSheet(null);

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
        <button
          onClick={() => setOpenEraserPopup(true)}
          className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg text-body-m-bold"
        >
          <img src={IconStar} alt="청연 지우개" className="w-5 h-5" />
          <span>청연 지우개</span>
        </button>

        <EraserAnalyzePopup
          open={openEraserPopup}
          onClose={() => setOpenEraserPopup(false)}
        />
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
            <GroupTaskTaskItem 
              key={taskItem.occurrenceId}
              task={taskItem}
              onClick={() => openEditSheet(taskItem)}
            />
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

      {/* 미완료 사유 바텀시트 */}
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

      {/* 멤버에게 부탁하기 바텀시트 */}
      <AssigneeBottomSheet
        open={sheet === 'member'}
        onClose={closeAllSheets}
        members={members}
        selectedId={selectedTask?.assignee.memberId ?? null}
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

export default GroupTaskList;