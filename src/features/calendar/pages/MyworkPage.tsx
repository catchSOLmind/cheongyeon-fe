// src/features/calendar/pages/MyworkPage.tsx
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import TaskList from '../components/TaskList';
import FloatingActionButton from '../components/Floatingactionbutton';
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import { useMyTasks } from '../hooks/useMyTasks';
import { formatDateKey } from '../utils/dateUtils';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import ImgDefault from '@/assets/common/img-default-profile.svg';

import { completeMyTasks, getMyTasksCalendar } from '../api/taskApi';
import type {
  MyTasksCalendarResponse,
  MyTasksCalendarParams,
} from '@/features/calendar/types/myTaskCalendar.types';

function MyworkPage() {
  const navigate = useNavigate();
  const { profile } = useUserStore();

  // 화면에 보이는 월(헤더/캘린더 기준)
  const [currentDate, setCurrentDate] = useState(new Date());
  // 실제 선택된 날짜(리스트 조회 기준)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // dot 찍을 날짜 목록(API에서 받음)
  const [taskDates, setTaskDates] = useState<string[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const selectedDateStr = formatDateKey(selectedDate);

  const { tasks, isLoading, refetch } = useMyTasks({
    date: selectedDateStr,
    enabled: true,
  });

  const safeTasks = tasks ?? [];

  // 현재 월이 바뀔 때마다 /my-tasks/calendar 호출
  useEffect(() => {
    let alive = true;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const run = async () => {
      try {
        setCalendarLoading(true);

        const params: MyTasksCalendarParams = { year, month };
        const res: MyTasksCalendarResponse = await getMyTasksCalendar(params);

        if (!alive) return;
        setTaskDates(res.taskDates ?? []);
      } catch (e) {
        console.error('[getMyTasksCalendar] error:', e);
        if (alive) setTaskDates([]);
      } finally {
        if (alive) setCalendarLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [currentDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // 선택한 날짜가 다른 달이면 currentDate도 갱신해서
    // 캘린더 dot용 API가 다시 호출되게 함
    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(date);
    }
  };

  // 체크/상태변경-완료에서 호출되는 API: refetch는 여기서 하지 말자(깜빡임 원인)
  const handleCompleteTask = useCallback(async (occurrenceId: number) => {
    await completeMyTasks(occurrenceId);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-5 py-2 flex-shrink-0">
        <div className="flex items-center">
          <span className="px-2 text-display-s text-[#262626]">
            {formatMonthYear(currentDate)}
          </span>
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

      <div className="px-3 bg-white mt-4 flex-shrink-0">
        <Calendar
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          taskDates={taskDates} //dot
        />

        {calendarLoading ? (
          <div className="px-3 pt-2 text-body-s text-gray-400">캘린더 불러오는 중...</div>
        ) : null}
      </div>

      <div className="flex-1 overflow-hidden">
        <TaskList
          task={safeTasks}
          isLoading={isLoading}
          selectedDate={selectedDate}
          onTaskUpdate={refetch} // 확정 저장(바텀시트 confirm)에서만 사용
          onCompleteTask={handleCompleteTask} // 체크/완료 API는 여기로
        />
        <FloatingActionButton showFeedback={false} showEdit={true} showAddTask={true} />
      </div>
    </div>
  );
}

export default MyworkPage;
