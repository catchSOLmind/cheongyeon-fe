// src/components/common/CalendarBottomSheet.tsx
import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAButton } from './BottomCTAButton';
import { BottomCTAWrapper } from './BottomCTAWrapper';
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';

type CalendarCell = {
  day: number;
  isCurrentMonth: boolean;
};

function getCalendarCells(year: number, month: number): CalendarCell[] {
  // month: 1~12 (입력), Date는 0-index라 내부에서 -1 처리
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const firstWeekday = firstDayOfMonth.getDay(); // 0(일)~6(토)
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 달 마지막 날짜
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  const cells: CalendarCell[] = [];

  // 1) 이전 달 채우기 (첫 주 빈칸)
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }

  // 2) 이번 달 채우기
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }

  // 3) 다음 달 채우기 (7의 배수 맞추기)
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, isCurrentMonth: false });
    nextDay += 1;
  }

  return cells;
}

interface CalendarBottomSheetProps {
  open: boolean;
  onClose: () => void;

  /** 바텀시트 높이 */
  height?: string;

  /** 표시용: "26년 2월" */
  monthLabel?: string;

  /** 표시용: 연/월 (선택값 만들 때 필요) */
  year?: number; // ex) 2026
  month?: number; // 1~12

  /** 초기 선택값 (부모가 넘겨주는 값) */
  value?: Date | null;

  /** 날짜 클릭할 때마다 부모로 전달 */
  onChange?: (date: Date) => void;

  /** CTA 누르면 최종 확정해서 부모로 전달(선택) */
  onConfirm?: (date: Date) => void;

  /** 하단 버튼 라벨 */
  ctaLabel?: string;
}

export default function CalendarBottomSheet({
  open,
  onClose,
  height = '423px',
  monthLabel = '26년 2월',
  year = 2026,
  month = 2,
  value = null,
  onChange,
  onConfirm,
}: CalendarBottomSheetProps) {
  // 내부 선택 상태(초기값은 value)
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  // 부모 value가 바뀌면 내부도 동기화
  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // year/month 기준으로 달력 셀 자동 생성
  const calendarCells = useMemo(() => getCalendarCells(year, month), [year, month]);

  // 선택된 "일"만 비교 (현재 month 기준)
  const selectedDay =
    selectedDate &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month - 1
      ? selectedDate.getDate()
      : null;

  const handlePickDay = (day: number) => {
    const next = new Date(year, month - 1, day);
    setSelectedDate(next);
    onChange?.(next);
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    onConfirm?.(selectedDate);
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={undefined}
      showHeaderDivider={false}
      showHandle={false}
      height={height}
      className="px-0"
      contentClassName="px-0 pt-0"
    >
      <div className="px-6 pt-6">
        {/* 상단: 월 라벨 + 좌우 화살표  */}
        <div className="flex items-center justify-between">
          <button type="button" className="flex items-center gap-1 text-display-m text-[#262626]">
            {monthLabel}
            <img src = {IconDropdown} className='w-5 h-5'/>
          </button>

          <div className="flex items-center gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-gray-50 active:bg-gray-100">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-gray-50 active:bg-gray-100">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 요일 */}
        <div className="text-center mt-4 grid grid-cols-7 text-label-l text-gray-500">
          {weekdays.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="mt-2 grid grid-cols-7 text-center">
          {calendarCells.map((cell, idx) => {
            const isSelected = cell.isCurrentMonth && selectedDay === cell.day;

            return (
              <button
                key={`${cell.day}-${cell.isCurrentMonth}-${idx}`}
                type="button"
                disabled={!cell.isCurrentMonth}
                onClick={() => cell.isCurrentMonth && handlePickDay(cell.day)}
                className={[
                  'h-12 flex items-center justify-center text-body-l-bold',
                  cell.isCurrentMonth ? (isSelected ? 'text-primary' : 'text-gray-800') : 'text-gray-200',
                ].join(' ')}
              >
                <span
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isSelected ? 'bg-primary-50' : 'bg-transparent',
                  ].join(' ')}
                >
                  {cell.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="px-6 pt-6">
        <BottomCTAWrapper fixed showTopBorder >
            <BottomCTAButton 
                onClick={handleConfirm}
                label='설정하기'/>
        </BottomCTAWrapper>
        
      </div>
    </BottomSheet>
  );
}
