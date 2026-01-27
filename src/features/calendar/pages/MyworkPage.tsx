import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';

function MyworkPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  // TODO: API 연결 후 실제 할 일 데이터로 변경
  const tasksByDate: Record<string, number> = {
    "2026-01-01": 2,
    "2026-01-02": 1,
    "2026-01-03": 1,
    "2026-01-04": 1,
  };

  return (
    <div>
      {/* 날짜 선택기 */}
      <div className="flex items-center justify-between px-5 py-7">
        <div className="flex items-center gap-1">
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
      <div className="px-3">
        <Calendar
          currentDate={currentDate}
          onDateSelect={setCurrentDate}
          tasksByDate={tasksByDate}
        />
      </div>
    </div>
  );
}

export default MyworkPage;
