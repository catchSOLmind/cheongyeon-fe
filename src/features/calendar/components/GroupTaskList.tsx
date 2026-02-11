import { useMemo, useState } from 'react';
import type {
  GroupTaskWeekItem,
  ManagerCallItem,
} from '../types/groupTask.types';
import GroupTaskTaskItem from './GroupTaskItem';
import IconStar from '@/assets/calendar/icon-star.svg';
import EraserAnalyzePopup from '@/features/eraser/components/EraserAnalyzePopup';
import ManagerCallCard from './ManagerCallCard';

interface GroupTaskListProps {
  task: GroupTaskWeekItem[];
  managerCall?: ManagerCallItem[];
  isLoading?: boolean;
  selectedDate: Date;
}

function GroupTaskList({
  task,
  managerCall = [],
  isLoading,
  selectedDate,
}: GroupTaskListProps) {
  const [openEraserPopup, setOpenEraserPopup] = useState(false);

  // =========================
  // task + manager 합치기
  // =========================
  type ListRow =
    | { kind: 'TASK'; key: string; item: GroupTaskWeekItem }
    | { kind: 'MANAGER'; key: string; item: ManagerCallItem };

  const rows = useMemo<ListRow[]>(() => {
    const taskRows: ListRow[] = (task ?? []).map((t) => ({
      kind: 'TASK',
      key: `task-${t.occurrenceId}`,
      item: t,
    }));

    const managerRows: ListRow[] = (managerCall ?? []).map((m) => ({
      kind: 'MANAGER',
      key: `manager-${m.reservationItemId}`,
      item: m,
    }));

    return [...managerRows, ...taskRows];
  }, [task, managerCall]);

  // =========================
  // 날짜 포맷
  // =========================
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

      {/* 리스트 */}
      {rows.length === 0 ? (
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
          {rows.map((row) => {
            if (row.kind === 'TASK') {
              return (
                <GroupTaskTaskItem
                  key={row.key}
                  task={row.item}
                />
              );
            }

            return (
              <ManagerCallCard
                key={row.key}
                item={row.item}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GroupTaskList;
