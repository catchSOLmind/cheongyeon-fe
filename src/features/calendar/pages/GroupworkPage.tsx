import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import GroupTaskList from "../components/GroupTaskList";
import FloatingActionButton from "../components/Floatingactionbutton";
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import { useGroupTasks } from "../hooks/useGroupTasks";
import { formatDateKey } from "../utils/dateUtils";
import { Dashboard } from "../components/Dashboard";
import ImgDefault from '@/assets/common/img-default-profile.svg';
import ImgNodata from '@/assets/calendar/img-no-data.png';
import { useUserStore } from "@/features/auth/stores/useUserStore";
import { getGroupTasksCalendar } from "../api/groupTaskApi";
import { deleteMyTask } from "../api/myTaskEditApi";
// import type { GroupTaskWeekItem } from "../types/groupTask.types";

function GroupworkPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  // dot
  const [taskDates, setTaskDates] = useState<string[]>([]);
  const [, setCalendarLoading] = useState(false);

  // ✅ 편집모드 추가
  const [isEditMode, setIsEditMode] = useState(false);

  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const isProfileFetched = useUserStore((s) => s.isProfileFetched);
  const isProfileLoading = useUserStore((s) => s.isLoading);

  const groupId = profile?.groupId;

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

  const { tasks, isLoading, refetch, isSoloGroup } = useGroupTasks({
    groupId: groupId ?? 0,
    date: selectedDateStr,
    enabled: typeof groupId === 'number' && groupId > 0,
  });

  // 날짜 바뀌면 편집모드 종료
  useEffect(() => {
    setIsEditMode(false);
  }, [selectedDateStr]);

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
        setTaskDates(res.taskDates ?? []);
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

  // FAB에서 edit 토글
  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // 다른 곳 누르면 edit 종료
  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  // 삭제 콜백 자리(그룹 삭제 API 붙일 곳)
  const handleDeleteGroupTask = useCallback(async (occurrenceId: number) => {
    await deleteMyTask(occurrenceId);
    refetch();
    console.log('[delete group task]', occurrenceId);
  }, []);

  if (isProfileLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-body-m text-gray-500">프로필 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!isSoloGroup) {
    return (
      <div className="h-[calc(100vh-200px)] bg-[#fafafa] flex items-center justify-center">
        <div className="-mt-10 flex flex-col items-center text-center">
          <img
            src={ImgNodata}
            className="w-[246px] h-[150px]"
            alt="no group"
          />
          <span className="-mt-3 text-display-xs text-black">
            캘린더를 공유중인 멤버가 없어요.
          </span>
          <span className="mt-2 text-body-m text-gray-500">
            멤버를 등록하고 가사 업무를 분담해보세요
          </span>
          <button
            type="button"
            className="mt-10 w-[120px] h-9 rounded-full bg-primary-50 text-primary text-body-m flex items-center justify-center"
            onClick={() => navigate('/agreement')}
          >
            멤버 초대
          </button>
        </div>
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
          isEditMode={isEditMode}
          onExitEditMode={handleExitEditMode}
          onDeleteTask={handleDeleteGroupTask}
        />
      </div>

      <div className="px-3 bg-white mt-4">
        <Dashboard />
      </div>

      <FloatingActionButton
          showFeedback={true}
          showEdit={false} // 수정하기 false
          showAddTask={true}
          onClickEdit={handleToggleEditMode}
      />
    </div>
  );
}

export default GroupworkPage;
