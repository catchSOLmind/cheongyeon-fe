import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import TaskList from "../components/TaskList";
import FloatingActionButton from "../components/Floatingactionbutton";
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import { useMyTasks } from "../hooks/useMyTasks";
import { formatDateKey } from "../utils/dateUtils";
import { Dashboard } from "../components/Dashboard";
import ImgDefault from '@/assets/common/img-default-profile.svg';
import { useUserStore } from "@/features/auth/stores/useUserStore";

function AllworkPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const { profile } = useUserStore();

  // 선택된 날짜를 YYYY-MM-DD 형식으로 변환
  const selectedDateStr = formatDateKey(selectedDate);

  // 내 할일 조회 API 호출
  // TODO: groupId는 실제 그룹/집 ID로 변경 필요 (현재는 임시로 1 사용)
  const { tasks, weekDates, isLoading, refetch } = useMyTasks({
    //groupId: 1, // TODO: 실제 groupId로 변경
    date: selectedDateStr,
    enabled: true,
  });

  // 캘린더 표시용 날짜별 할일 개수
  const tasksByDate = useMemo(() => {
    // API가 이미 해당 주의 할일을 반환하므로
    // weekDates에 대해 간단히 표시용 데이터 생성
    const result: Record<string, number> = {};
    weekDates.forEach(date => {
      result[date] = 1; // 할일이 있다고 표시 (실제 개수는 서버에서 관리)
    });
    return result;
  }, [weekDates]);

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
          <img
            src={profile?.profileImageUrl || ImgDefault}
            alt={profile?.nickname || '프로필'}
            className="w-full h-full object-cover"
          />
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
      <div className="min-h-[270px] bg-[#fafafa]">
      <TaskList
        task={tasks}
        isLoading={isLoading}
        selectedDate={selectedDate}
        onTaskUpdate={refetch}
      />
      </div>

      <div className="px-3 bg-white mt-4">
        <Dashboard />
      </div>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton
        showFeedback={true}
        showEdit={true}
        showAddTask={true}
      />
    </div>
  );
}

export default AllworkPage;