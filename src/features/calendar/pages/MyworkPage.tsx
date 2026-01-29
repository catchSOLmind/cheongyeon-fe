import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import TaskList from "../components/TaskList";
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import { useMyTasks } from "../hooks/useMyTasks";
import { formatDateKey } from "../utils/dateUtils";
import { taskItemsToTasks, groupTaskItemsByDate } from "../utils/taskAdapter";
import type { Task } from "../utils/taskAdapter";

function MyworkPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  // 선택된 날짜를 YYYY-MM-DD 형식으로 변환
  const selectedDateStr = formatDateKey(selectedDate);

  // 내 할일 조회 API 호출
  // TODO: groupId는 실제 그룹/집 ID로 변경 필요 (현재는 임시로 1 사용)
  const { tasks: taskItems, weekDates, isLoading, refetch } = useMyTasks({
    groupId: 1, // TODO: 실제 groupId로 변경
    date: selectedDateStr,
    enabled: true,
  });

  // TaskItem을 Task로 변환 (선택된 날짜 기준)
  const tasks: Task[] = useMemo(() => {
    return taskItemsToTasks(taskItems, selectedDateStr);
  }, [taskItems, selectedDateStr]);

  // 캘린더 표시용 날짜별 할일 개수 (weekDates 기반)
  const tasksByDate = useMemo(() => {
    return groupTaskItemsByDate(taskItems, weekDates);
  }, [taskItems, weekDates]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // 선택한 날짜가 다른 월이면 currentDate도 업데이트
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(date);
    }
  };

  return (
    <div>
      {/* 날짜 선택기 */}
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center">
          <span className="px-2 text-display-s text-[#262626]">{formatMonthYear(currentDate)}</span>
          <img src={IconDropdown} alt="dropdown" className="w-5 h-5" />
        </div>
        <button
          onClick={() => navigate('/mypage')}
          className="mx-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
        >
          {/* TODO: 실제 프로필 이미지로 변경 */}
        </button>
      </div>

      {/* 캘린더 */}
      <div className="px-3 bg-white mt-4">
        <Calendar
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          tasksByDate={tasksByDate}
        />
      </div>

      {/* 선택된 날짜의 할일 리스트 */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        selectedDate={selectedDate}
        onTaskUpdate={refetch}
      />
    </div>
  );
}

export default MyworkPage;
