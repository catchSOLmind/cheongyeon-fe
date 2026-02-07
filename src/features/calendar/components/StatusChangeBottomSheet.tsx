import { useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import type { TaskStatus } from '../types/task.types';

interface StatusChangeBottomSheetProps {
  open: boolean;
  onClose: () => void;
  initialStatus: TaskStatus;
  onConfirm: (status: TaskStatus) => void;
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
  onConfirm,
}: StatusChangeBottomSheetProps) {
  // open될 때만 초기값 사용
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(initialStatus);

  // 바텀시트가 다시 열릴 때 초기화
  if (open && selectedStatus !== initialStatus) {
    setSelectedStatus(initialStatus);
  }

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="상태 변경하기"
      height="420px"
      showHeaderDivider
    >
      <div className="flex flex-col gap-3 pt-2">
        {STATUS_OPTIONS.map((option) => {
          const isSelected = option.value === selectedStatus;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedStatus(option.value)}
              className={[
                'w-full rounded-xl px-4 py-4 text-left text-body-l-bold',
                'transition-colors',
                isSelected
                  ? 'bg-[#F1FBFF] border border-primary text-gray-900'
                  : 'bg-white text-gray-700',
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
          className="flex-1 h-12 rounded-xl bg-gray-100 text-body-m-bold text-gray-500"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 h-12 rounded-xl bg-gray-800 text-body-m-bold text-white"
        >
          확인
        </button>
      </div>
    </BottomSheet>
  );
}
