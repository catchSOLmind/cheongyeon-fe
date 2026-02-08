// src/features/calendar/pages/MyworkPage.tsx (경로는 네 프로젝트 기준)
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import TaskList from "../components/TaskList";
import FloatingActionButton from "../components/Floatingactionbutton";
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import { useMyTasks } from "../hooks/useMyTasks";
import { formatDateKey } from "../utils/dateUtils"; 
import { useUserStore } from "@/features/auth/stores/useUserStore";
import ImgDefault from '@/assets/common/img-default-profile.svg';

import { completeMyTasks } from "../api/taskApi";

function MyworkPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const { profile } = useUserStore();
  const selectedDateStr = formatDateKey(selectedDate);

  const { tasks, weekDates, isLoading, refetch } = useMyTasks({
    date: selectedDateStr,
    enabled: true,
  });

  const tasksByDate = useMemo(() => {
    const result: Record<string, number> = {};
    weekDates.forEach((date) => {
      result[date] = 1;
    });
    return result;
  }, [weekDates]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(date);
    }
  };

  // ✅ 체크/상태변경-완료에서 호출되는 API: refetch는 여기서 하지 말자(깜빡임 원인)
  const handleCompleteTask = useCallback(async (occurrenceId: number) => {
    await completeMyTasks(occurrenceId);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center">
          <span className="px-2 text-display-s text-[#262626]">{formatMonthYear(currentDate)}</span>
          <img src={IconDropdown} alt="dropdown" className="w-5 h-5" />
        </div>
        <button
          onClick={() => navigate('/mypage')}
          className="mx-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={profile?.profileImageUrl || ImgDefault}
            alt={profile?.nickname || '프로필'}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <div className="px-3 bg-white mt-4">
        <Calendar
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          tasksByDate={tasksByDate}
        />
      </div>

      <TaskList
        task={tasks}
        isLoading={isLoading}
        selectedDate={selectedDate}
        onTaskUpdate={refetch}          // 확정 저장(바텀시트 confirm)에서만 사용
        onCompleteTask={handleCompleteTask} // 체크/완료 API는 여기로
      />

      <FloatingActionButton showFeedback={false} showEdit={true} showAddTask={true} />
    </div>
  );
}

export default MyworkPage;
