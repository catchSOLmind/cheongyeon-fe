import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import GroupTaskList from "../components/GroupTaskList";
import FloatingActionButton from "../components/Floatingactionbutton";
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import { useGroupTasks } from "../hooks/useGroupTasks";
import { formatDateKey } from "../utils/dateUtils";
import { Dashboard } from "../components/Dashboard";
import ImgDefault from '@/assets/common/img-default-profile.svg';
import { useUserStore } from "@/features/auth/stores/useUserStore";
import { getGroupTasksCalendar } from "../api/groupTaskApi";

function GroupworkPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  // dot
  const [taskDates, setTaskDates] = useState<string[]>([]);
  const [, setCalendarLoading] = useState(false);

  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const isProfileFetched = useUserStore((s) => s.isProfileFetched);
  const isProfileLoading = useUserStore((s) => s.isLoading);

  const groupId = profile?.groupId;

  // 디버깅: groupId 확인
  // console.log('🔍 GroupworkPage Debug:', {
  //   profile,
  //   groupId,
  //   isProfileFetched,
  //   isProfileLoading,
  //   hasGroupId: typeof groupId === 'number' && groupId > 0
  // });
  
  useEffect(() => {
    if (!isProfileFetched) {
      fetchProfile();
    }
  }, [isProfileFetched, fetchProfile]);

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const selectedDateStr = formatDateKey(selectedDate);

  const { tasks, isLoading, refetch } = useGroupTasks({
    groupId: groupId ?? 0,
    date: selectedDateStr,
    enabled: typeof groupId === 'number' && groupId > 0,
  });

    useEffect(() => {
    if (!groupId || groupId <= 0) return;

    let alive = true;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const run = async () => {
      try {
        setCalendarLoading(true);

        const res = await getGroupTasksCalendar({
          groupId,
          year,
          month,
        });

        if (!alive) return;
        setTaskDates(res.taskDates?? []);
      } catch (e) {
        console.error('[getGroupTasksCalendar] error:', e);
        if (alive) setTaskDates([]);
      } finally {
        if (alive) setCalendarLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [currentDate, groupId]);


  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(date);
    }
  };

  if (isProfileLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-body-m text-gray-500">프로필 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center">
          <span className="px-2 text-display-s text-[#262626]">
            {formatMonthYear(currentDate)}
          </span>
          <img src={IconDropdown} alt="dropdown" className="w-5 h-5" />
        </div>

        <button
          onClick={() => navigate('/mypage')}
          className="mx-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          type="button"
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
          taskDates={taskDates}
        />
      </div>

      <div className="min-h-[270px] bg-[#fafafa]">
        <GroupTaskList
          task={tasks}
          isLoading={isLoading}
          selectedDate={selectedDate}
          onTaskUpdate={refetch}
        />
      </div>

      <div className="px-3 bg-white mt-4">
        <Dashboard />
      </div>
      <FloatingActionButton showFeedback showEdit showAddTask />
    </div>
  );
}

export default GroupworkPage;
