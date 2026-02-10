// src/features/calendar/components/StatusChangeBottomSheet.tsx
import { useEffect, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import type { MyTaskWeekItem, TaskStatus } from '../types/task.types';
import type { GroupTaskWeekItem } from '../types/groupTask.types';

interface StatusChangeBottomSheetProps {
  open: boolean;
  onClose: () => void;
  initialStatus: TaskStatus;
  task: MyTaskWeekItem | GroupTaskWeekItem| null;

  /** WAITING / IN_PROGRESS / COMPLETED 선택 시 확정 */
  onConfirmStatus: (status: Exclude<TaskStatus, 'INCOMPLETED'>) => void;

  /** INCOMPLETED 선택 시 다음 바텀시트로 */
  onOpenIncompleteReason: () => void;
}

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: '대기중', value: 'WAITING' },
  { label: '진행중', value: 'IN_PROGRESS' },
  { label: '미완료', value: 'INCOMPLETED' },
  { label: '완료', value: 'COMPLETED' },
];

export default function StatusChangeBottomSheet({
  open,
  onClose,
  initialStatus,
  onConfirmStatus,
  onOpenIncompleteReason,
}: StatusChangeBottomSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(initialStatus);

  // 열릴 때마다 초기화 (이게 제일 안전 + 에러 안남)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setSelectedStatus(initialStatus);
  }, [open, initialStatus]);

  const handleConfirm = () => {
    if (selectedStatus === 'INCOMPLETED') {
      onOpenIncompleteReason(); // 다음 시트로
      return;
    }

    onConfirmStatus(selectedStatus); // 여기서 API 호출하도록 부모가 구현
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="상태 변경하기"
      height="420px"
      showHeaderDivider
    >
      <div className="flex flex-col gap-3">
        {STATUS_OPTIONS.map((option) => {
          const isSelected = option.value === selectedStatus;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedStatus(option.value)}
              className={[
                'w-full rounded-xl px-4 py-3 text-left text-body-l-bold transition-colors',
                isSelected
                  ? 'bg-[#F1FBFF] border border-primary text-gray-900'
                  : 'bg-white text-gray-900',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-12 rounded-lg bg-gray-200 text-body-m-bold text-gray-500"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 h-12 rounded-lg bg-[#424B4C] text-body-m-bold text-white"
        >
          확인
        </button>
      </div>
    </BottomSheet>
  );
}
