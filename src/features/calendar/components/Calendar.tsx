import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  formatDateKey,
  getWeekDates,
  getMonthGridDates,
  isSameDay,
  isInFirstWeekOfMonth,
} from '@/features/calendar/utils/date.utils';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface CalendarProps {
  currentDate?: Date; // 오늘 날짜 
  onDateSelect?: (date: Date) => void; //선택된 날짜 
  taskDates?: string[]; // 할일이 존재하는 날짜 목록 
}

function Calendar({
  currentDate = new Date(),
  onDateSelect,
  taskDates = [],
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // currentDate prop이 변경될 때 selectedDate 동기화
  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  // 빠른 조회를 위해 Set으로 변환 (렌더링 최적화)
  const taskDateSet = useMemo(() => new Set(taskDates), [taskDates]);

  // currentDate 기준 “이번 주” (오늘 고정이 아니라 prop 기준이 더 일관적)
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // 선택된 날짜 기준 월 그리드
  const monthDates = useMemo(() => getMonthGridDates(selectedDate), [selectedDate]);

  const currentMonth = selectedDate.getMonth();

  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    },
    [onDateSelect],
  );

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // 선택된 날짜가 첫 번째 주에 있는지 확인 (월간 캘린더용)
  const selectedIsInFirstWeek = useMemo(
    () => isInFirstWeekOfMonth(selectedDate),
    [selectedDate],
  );
  const selectedDayIndex = selectedDate.getDay();

  // 할일이 있다면 닷 표시
  const hasDot = useCallback(
    (date: Date) => taskDateSet.has(formatDateKey(date)),
    [taskDateSet],
  );

  // 주간 뷰에서 선택된 날짜가 “이번 주”에 존재하는지
  const isSelectedInWeekView = useMemo(() => {
    if (isExpanded) return false;
    return weekDates.some((d) => isSameDay(d, selectedDate));
  }, [isExpanded, weekDates, selectedDate]);

  const selectedWeekDayIndex = isSelectedInWeekView ? selectedDate.getDay() : -1;

  return (
    <div ref={containerRef} className="w-full relative px-3">
      {/* 요일 라벨 (항상 고정) */}
      <div className="grid grid-cols-7 gap-1">
        {dayLabels.map((day, index) => {
          // 월간 캘린더에서 첫 번째 주 선택된 날짜인지 확인
          const isSelectedInMonthView =
            isExpanded && selectedIsInFirstWeek && index === selectedDayIndex;

          const isSelectedDay =
            (isSelectedInWeekView && index === selectedWeekDayIndex) || isSelectedInMonthView;

          return (
            <div
              key={index}
              className={`
                text-center text-label-l-regular py-1 pointer-events-none
                ${isSelectedDay ? 'bg-primary text-white rounded-t-lg text-label-l-regular' : 'text-gray-600'}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 주간(한 줄) 날짜 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-0 opacity-0' : 'max-h-[56px] opacity-100'
        }`}
      >
        <div className="grid grid-cols-7 gap-1 -mt-1">
          {weekDates.map((date, index) => {
            const selected = isSameDay(date, selectedDate);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  h-10 flex items-center justify-center text-body-l-bold relative
                  ${
                    selected
                      ? 'bg-primary text-white rounded-b-lg'
                      : 'text-gray-900 hover:bg-gray-100 rounded-full'
                  }
                `}
              >
                {date.getDate()}
                {hasDot(date) && (
                  <div
                    className={[
                      'absolute bottom-0.5 w-[6px] h-[6px] rounded-full',
                      selected ? 'bg-white' : 'bg-primary',
                    ].join(' ')}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 월간 날짜 */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="grid grid-cols-7 gap-1 -mt-1">
          {monthDates.map((date, index) => {
            const selected = isSameDay(date, selectedDate);
            const inMonth = date.getMonth() === currentMonth;

            const isFirstWeek = isInFirstWeekOfMonth(date);
            const isSelectedInFirstWeekCell = selected && isFirstWeek;

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square flex items-center justify-center relative
                  text-body-l-bold
                  ${
                    isSelectedInFirstWeekCell
                      ? 'bg-primary text-white rounded-b-lg'
                      : selected
                        ? 'bg-primary text-white rounded-lg'
                        : inMonth
                          ? 'text-gray-900 hover:bg-gray-100 rounded-lg'
                          : 'text-white rounded-lg'
                  }
                `}
              >
                {date.getDate()}
                {hasDot(date) && (
                  <div
                    className={[
                      'absolute bottom-0.5 w-[6px] h-[6px] rounded-full',
                      selected ? 'bg-white' : 'bg-primary',
                    ].join(' ')}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 토글 바 */}
      <div className="flex justify-center mt-2">
        <button
          onClick={handleToggleExpand}
          className="w-14 h-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
          aria-label={isExpanded ? '캘린더 축소' : '캘린더 확장'}
        />
      </div>

      {/* 하단 구분선 */}
      <div className="border-b border-gray-200 mt-2" />
    </div>
  );
}

export default Calendar;
