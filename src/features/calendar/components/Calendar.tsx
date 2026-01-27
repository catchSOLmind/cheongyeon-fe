import { useState, useRef, useEffect } from 'react';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface CalendarProps {
  currentDate?: Date;
  onDateSelect?: (date: Date) => void;
  tasksByDate?: Record<string, number>; // 날짜별 할 일 개수
}

function Calendar({
  currentDate = new Date(),
  onDateSelect,
  tasksByDate = {},
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // currentDate prop이 변경될 때 selectedDate 동기화
  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  const today = new Date();

  // 오늘 기준 주간 날짜
  const getTodayWeekDates = () => {
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

  const isToday = (date: Date) => {
    const t = new Date();
    return (
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    );
  };

  const isSelected = (date: Date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth;

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div ref={containerRef} className="w-full relative px-3">
      {/* 요일 라벨 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((day, index) => (
          <div
            key={index}
            className="text-center text-body-s text-gray-600 pointer-events-none"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 주간(한 줄) 날짜 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-0 opacity-0' : 'max-h-[56px] opacity-100'
        }`}
      >
        <div className="grid grid-cols-7 gap-1">
          {todayWeekDates.map((date, index) => {
            const dateKey = formatDateKey(date);
            const hasTasks = (tasksByDate[dateKey] ?? 0) > 0;
            const currentDay = isToday(date);
            const selected = isSelected(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  h-10 rounded-full flex items-center justify-center text-body-m relative
                  ${
                    selected
                      ? 'bg-primary text-white'
                      : currentDay
                        ? 'bg-primary/20 text-primary'
                        : 'text-black hover:bg-gray-100'
                  }
                `}
              >
                {date.getDate()}
                {hasTasks && <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary" />}
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
        <div className="grid grid-cols-7 gap-1">
          {monthDates.map((date, index) => {
            const dateKey = formatDateKey(date);
            const hasTasks = (tasksByDate[dateKey] ?? 0) > 0;

            const currentDay = isToday(date);
            const selected = isSelected(date);
            const inMonth = isCurrentMonth(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square flex items-center justify-center text-body-m relative rounded-lg
                  ${
                    selected
                      ? 'bg-primary text-white'
                      : currentDay
                        ? 'bg-primary/20 text-primary'
                        : inMonth
                          ? 'text-black hover:bg-gray-100'
                          : 'text-gray-400'
                  }
                `}
              >
                {date.getDate()}
                {hasTasks && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />}
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
    </div>
  );
}

export default Calendar;
