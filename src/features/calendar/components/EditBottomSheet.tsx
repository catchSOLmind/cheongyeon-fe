// EditBottomSheet.tsx
import BottomSheet from '@/shared/components/BottomSheet';
import type { MyTaskWeekItem } from '../types/task.types';
import IconChange from "@/assets/calendar/toggle/icon-change.svg";
import IconDelete from "@/assets/calendar/toggle/icon-delete.svg";
import IconGive from "@/assets/calendar/toggle/icon-give.svg";
import IconPencil from "@/assets/calendar/toggle/icon-pencil.svg";
import IconState from "@/assets/calendar/toggle/icon-state.svg";

interface EditBottomSheetProps {
  open: boolean;
  onClose: () => void;
  task: MyTaskWeekItem | null;

  onOpenDateChange: () => void; // 날짜 변경 
  onOpenStatusChange: () => void; // 상태 변경 
}

export default function EditBottomSheet({
  open,
  onClose,
  task,
  onOpenDateChange,
  onOpenStatusChange, 
}: EditBottomSheetProps) {

  const handleStatusChange = () => {
    //console.log('상태 변경하기', task?.occurrenceId);
    onOpenStatusChange(); // 상태 변경 시트 열기
  };

  const handleDateChange = () => {
    //console.log('날짜 변경하기', task?.occurrenceId);
    onOpenDateChange(); // 날짜 변경 시트 열기
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={task?.taskName ?? ''}
      height="410px"
      showHeaderDivider
    >
      <div className="flex flex-col gap-4 pt-1">

        {/* 상태 변경 */}
        <button
          className="flex gap-4 px-4 py-3"
          onClick={handleStatusChange}
        >
          <img src={IconState} className="w-6 h-6" />
          <span className="text-body-l-bold">상태 변경하기</span>
        </button>

        {/* 날짜 변경 */}
        <button
          className="flex gap-4 px-4 py-3"
          onClick={handleDateChange}
        >
          <img src={IconChange} className="w-6 h-6" />
          <span className="text-body-l-bold">날짜 변경하기</span>
        </button>

        <button className="flex gap-4 px-4 py-3">
          <img src={IconGive} className="w-6 h-6" />
          <span className="text-body-l-bold">멤버에게 부탁하기</span>
        </button>

        <button className="flex gap-4 px-4 py-3">
          <img src={IconPencil} className="w-6 h-6" />
          <span className="text-body-l-bold">수정하기</span>
        </button>

        <button className="flex gap-4 px-4 py-3">
          <img src={IconDelete} className="w-6 h-6" />
          <span className="text-body-l-bold text-red-500">삭제하기</span>
        </button>
      </div>
    </BottomSheet>
  );
}
