// src/features/calendar/pages/GroupworkPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Calendar from '../components/Calendar';
import GroupTaskList from '../components/GroupTaskList';
import FloatingActionButton from '../components/Floatingactionbutton';
import { Dashboard } from '../components/Dashboard';

import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import ImgDefault from '@/assets/common/img-default-profile.svg';
import ImgNodata from '@/assets/calendar/img-no-data.png';

import { useGroupTasks } from '../hooks/useGroupTasks';
import { formatDateKey } from '../utils/date.utils';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import { getGroupTasksCalendar } from '../api/groupTaskApi';

function GroupworkPage() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // dot
  const [taskDates, setTaskDates] = useState<string[]>([]);
  const [, setCalendarLoading] = useState(false);

  // 편집모드
  const [, setIsEditMode] = useState(false);

  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const isProfileFetched = useUserStore((s) => s.isProfileFetched);
  const isProfileLoading = useUserStore((s) => s.isLoading);

  const groupId = profile?.groupId;

  // 프로필 확보
  useEffect(() => {
    if (!isProfileFetched) fetchProfile();
  }, [isProfileFetched, fetchProfile]);

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const selectedDateStr = formatDateKey(selectedDate);

  const isGroupIdReady = typeof groupId === 'number';
  const enabled = isGroupIdReady;

  const { tasks, managerCall, isLoading, agreementStatus } = useGroupTasks({
    groupId: (groupId ?? 0) as number,
    date: selectedDateStr,
    enabled,
  });

  const canDecideNoData = useMemo(() => {
    if (!isProfileFetched) return false;
    if (isProfileLoading) return false;
    if (!isGroupIdReady) return false;
    if (!enabled) return false;
    if (isLoading) return false;
    return true;
  }, [enabled, isGroupIdReady, isLoading, isProfileFetched, isProfileLoading]);

  // 날짜 바뀌면 편집모드 종료
  useEffect(() => {
    setIsEditMode(false);
  }, [selectedDateStr]);

  // 달 변경 시 dot 데이터 가져오기
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

  const handleToggleEditMode = () => setIsEditMode((prev) => !prev);

  /* =========================
   * 1) 프로필 자체 로딩 화면
   * ========================= */
  if (!isProfileFetched || (isProfileLoading && !profile)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-body-m text-gray-500">프로필 정보를 불러오는 중...</p>
      </div>
    );
  }

  /* =========================
   * 2) 그룹 여부 판단 전 가드 화면
   * ========================= */
  if (!canDecideNoData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-[#fafafa]">
        <p className="text-body-m text-gray-500">그룹 정보를 확인하는 중...</p>
      </div>
    );
  }

  /* =========================
   * 3) no-data 분기 (agreementStatus === 'NONE')
   * ========================= */
  if (agreementStatus === 'NONE') {
    return (
      <div className="h-[calc(100vh-200px)] bg-[#fafafa] flex items-center justify-center">
        <div className="-mt-10 flex flex-col items-center text-center">
          <img
            src={ImgNodata}
            className="w-[246px] h-[150px]"
            alt="no group"
          />
          <span className="-mt-3 text-display-xs text-black">
            멤버들과 함께 협약서를 작성해보세요.
          </span>
          <span className="mt-2 text-body-m text-gray-500">
            멤버를 등록하고 가사 업무를 분담해보세요.
          </span>
          <button
            type="button"
            className="mt-10 w-[120px] h-9 rounded-full bg-primary-50 text-primary text-body-m flex items-center justify-center"
            onClick={() => navigate('/agreement')}
          >
            협약서 작성하기
          </button>
        </div>
      </div>
    );
  }

  /* =========================
   * 4) DRAFT or CONFIRMED — 정상 화면
   * ========================= */
  return (
    <div>
      <div className="flex items-center justify-between px-5 py-2 flex-shrink-0 bg-white">
        <div className="flex items-center pb-4">
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

      <div className="px-3 bg-white">
        <Calendar
          currentDate={selectedDate}
          onDateSelect={handleDateSelect}
          taskDates={taskDates}
        />
      </div>

      <div className="min-h-[270px] bg-[#fafafa]">
        <GroupTaskList
          task={tasks}
          isLoading={isLoading}
          managerCall={managerCall}
          selectedDate={selectedDate}
        />
      </div>

      <div className="px-3 bg-white mt-4">
        <Dashboard agreementStatus={agreementStatus ?? 'NONE'} />
      </div>

      <FloatingActionButton
        showFeedback={true}
        showEdit={false}
        showAddTask={true}
        onClickEdit={handleToggleEditMode}
      />
    </div>
  );
}

export default GroupworkPage;