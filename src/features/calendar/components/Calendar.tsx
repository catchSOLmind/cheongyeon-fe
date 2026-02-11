import { useState, useRef, useEffect, useMemo } from 'react';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface CalendarProps {
  currentDate?: Date;
  onDateSelect?: (date: Date) => void;

  /** /my-tasks/calendar에서 받은 날짜 목록: ['2026-02-09', ...] */
  taskDates?: string[];
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

  // 오늘 기준 주간 날짜 (항상 이번 주)
  const getTodayWeekDates = () => {
    const today = new Date();
    const week: Date[] = [];
    const day = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - day);

    for (let i = 0; i < 7; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      week.push(current);
    }
    return week;
  };

  // 월간 날짜 (필요 주 수에 맞춰 동적 계산)
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const lastDay = new Date(year, month + 1, 0);
    const totalCells = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7) * 7;

    const dates: Date[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < totalCells; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const todayWeekDates = getTodayWeekDates();
  const monthDates = getMonthDates(selectedDate);
  const currentMonth = selectedDate.getMonth();

  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;

  const isSelected = (date: Date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth;

  // 선택된 날짜가 첫 번째 주에 있는지 확인
  const isInFirstWeek = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstWeekStart = new Date(firstDayOfMonth);
    firstWeekStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
    firstWeekStart.setHours(0, 0, 0, 0);

    const dateWeekStart = new Date(date);
    dateWeekStart.setDate(date.getDate() - date.getDay());
    dateWeekStart.setHours(0, 0, 0, 0);

    return firstWeekStart.getTime() === dateWeekStart.getTime();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  // 선택된 날짜가 첫 번째 주에 있는지 확인 (월간 캘린더용)
  const selectedIsInFirstWeek = isInFirstWeek(selectedDate);
  const selectedDayIndex = selectedDate.getDay();

  // 할일이 있다면 닷 표시
  const hasDot = (date: Date) => taskDateSet.has(formatDateKey(date));

  return (
    <div ref={containerRef} className="w-full relative px-3">
      {/* 요일 라벨 (항상 고정) */}
      <div className="grid grid-cols-7 gap-1">
        {dayLabels.map((day, index) => {
          // 주간 캘린더에서 선택된 날짜인지 확인
          const isSelectedInWeekView =
            !isExpanded && todayWeekDates.some((date) => isSelected(date));
          const selectedWeekDayIndex = isSelectedInWeekView ? selectedDate.getDay() : -1;

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
          {todayWeekDates.map((date, index) => {
            const selected = isSelected(date);

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
            const selected = isSelected(date);
            const inMonth = isCurrentMonth(date);
            const isFirstWeek = isInFirstWeek(date);
            const isSelectedInFirstWeek = selected && isFirstWeek;

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square flex items-center justify-center relative
                  text-body-l-bold
                  ${
                    isSelectedInFirstWeek
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
