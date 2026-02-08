/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState, } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import ImgAlarm from '@/assets/calendar/img-alram.png';
import { useNavigate } from 'react-router-dom';

// ---------- Calendar UI utils ----------
type CalendarCell = { day: number; isCurrentMonth: boolean };

function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const firstWeekday = firstDayOfMonth.getDay(); // 0~6
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay, isCurrentMonth: false });
    nextDay += 1;
  }
  return cells;
}

function formatMonthLabel(year: number, month: number) {
  return `${String(year).slice(2)}년 ${month}월`;
}

function formatDateLabel(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ---------- Flow ----------
type Step = 'FORM' | 'CALENDAR' | 'DONE';

type Props = {
  open: boolean;
  onClose: () => void;

  /** UI용 초기 값(없어도 됨) */
  initialDate?: Date | null;

  /** Step2 CTA 라벨을 상황에 따라 바꾸고 싶으면 */
  calendarCtaLabel?: string; // ex) "변경하기" | "연결하기"
};

export default function RescheduleFlowBottomSheet({
  open,
  onClose,
  initialDate = null,
  calendarCtaLabel = '변경하기',
}: Props) {
  const [step, setStep] = useState<Step>('FORM');

  // 캘린더 뷰(표시용 월)
  const [viewYear, setViewYear] = useState<number>(
    (initialDate ?? new Date()).getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    (initialDate ?? new Date()).getMonth() + 1
  );

  // 선택 날짜(UI용)
  const [pickedDate, setPickedDate] = useState<Date | null>(initialDate);

  useEffect(() => {
    if (!open) return;
    setStep('FORM');
    setPickedDate(initialDate);

    const base = initialDate ?? new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth() + 1);
  }, [open, initialDate]);

  // 높이 
  const STEP_HEIGHT: Record<Step, string> = {
  FORM: '318px',     // 일정 변경하기
  CALENDAR: '423px', // 캘린더
  DONE: '345px',     // 완료 화면 
    };

  const height = STEP_HEIGHT[step];

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={undefined}
      showHeaderDivider={false}
      showHandle={true}
      height={height}
      className="px-0"
      contentClassName="px-0 pt-0"
    >
      {step === 'FORM' && (
        <FormStep
          pickedDate={pickedDate}
          onOpenCalendar={() => setStep('CALENDAR')}
          onNext={() => setStep('CALENDAR')}
        />
      )}

      {step === 'CALENDAR' && (
        <CalendarStep
          viewYear={viewYear}
          viewMonth={viewMonth}
          setViewYear={setViewYear}
          setViewMonth={setViewMonth}
          pickedDate={pickedDate}
          setPickedDate={setPickedDate}
          ctaLabel={calendarCtaLabel}
          onBack={() => setStep('FORM')}
          onConfirm={() => setStep('DONE')}
        />
      )}

      {step === 'DONE' && (
        <DoneStep
          onClose={onClose}
        />
      )}
    </BottomSheet>
  );
}

// ---------- Step 1: 일정 변경하기 ----------
function FormStep({
  pickedDate,
  onOpenCalendar,
}: {
  pickedDate: Date | null;
  onOpenCalendar: () => void;
  onNext: () => void;
}) {
  return (
    <div className="px-2 pt-3">
      <h2 className="text-body-l-bold text-gray-900 text-center">
        일정 변경하기
      </h2>
      <div className="mt-3 h-px w-full bg-gray-200" />
      <div className="mt-3">
        <div>
          <p className="text-label-m text-gray-500 mb-[10px]">일시</p>
          <button
            type="button"
            className="w-full rounded-xl border border-gray-200 px-5 py-4 text-left"
            onClick={onOpenCalendar}
          >
            <p className="text-body-m-bold text-gray-900">
              {pickedDate ? formatDateLabel(pickedDate) : '날짜를 선택해주세요'}
            </p>
          </button>
        </div>

        <div className="mt-3">
          <p className="text-label-m text-gray-500 mb-[10px]">시간</p>
          <button
            type="button"
            className="w-full rounded-xl border border-gray-200 px-5 py-4 text-left"
          >
            <p className="text-body-m-bold text-gray-900">오전 11:00</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Step 2: 캘린더 ----------
function CalendarStep({
  viewYear,
  viewMonth,
  setViewYear,
  setViewMonth,
  pickedDate,
  setPickedDate,
  ctaLabel,
  onConfirm,
}: {
  viewYear: number;
  viewMonth: number;
  setViewYear: (y: number) => void;
  setViewMonth: (m: number) => void;

  pickedDate: Date | null;
  setPickedDate: (d: Date) => void;

  ctaLabel: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const selectedDay =
    pickedDate &&
    pickedDate.getFullYear() === viewYear &&
    pickedDate.getMonth() === viewMonth - 1
      ? pickedDate.getDate()
      : null;

  const handlePickDay = (day: number) => {
    const next = new Date(viewYear, viewMonth - 1, day);
    setPickedDate(next);
  };

  const handlePrev = () => {
    const prev = new Date(viewYear, viewMonth - 2, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth() + 1);
  };

  const handleNext = () => {
    const next = new Date(viewYear, viewMonth, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
  };

  return (
    <div className="px-0">
      <div className="px-5 pt-6">
        {/* 상단 */}
        <div className="flex items-center justify-between">
          <button type="button" className="flex items-center gap-1 text-display-m text-[#262626]">
            {formatMonthLabel(viewYear, viewMonth)}
            <img src={IconDropdown} className="w-5 h-5" alt="" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-50 active:bg-gray-100">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" onClick={handleNext} className="p-2 rounded-full hover:bg-gray-50 active:bg-gray-100">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 요일 */}
        <div className="text-center mt-4 grid grid-cols-7 text-label-l text-gray-500">
          {weekdays.map((w) => (
            <div key={w} className="py-2">{w}</div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="mt-2 grid grid-cols-7 text-center">
          {cells.map((cell, idx) => {
            const isSelected = cell.isCurrentMonth && selectedDay === cell.day;

            return (
              <button
                key={`${cell.day}-${cell.isCurrentMonth}-${idx}`}
                type="button"
                disabled={!cell.isCurrentMonth}
                onClick={() => cell.isCurrentMonth && handlePickDay(cell.day)}
                className={[
                  'h-12 flex items-center justify-center text-body-l-bold',
                  cell.isCurrentMonth ? (isSelected ? 'text-primary' : 'text-gray-800') : 'text-gray-800',
                ].join(' ')}
              >
                <span
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isSelected ? 'bg-primary-50' : 'bg-transparent',
                  ].join(' ')}
                >
                  {cell.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pt-6">
        <BottomCTAWrapper fixed showTopBorder>
          <BottomCTAButton
            label={ctaLabel}
            disabled={!pickedDate}
            onClick={onConfirm}
          />
        </BottomCTAWrapper>
      </div>
    </div>
  );
}

// ---------- Step 3: 완료 ----------
function DoneStep({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();
  
  return (
    <div className="px-5 pt-10 pb-8">
      <img src = {ImgAlarm} className='-mx-3 w-[70px] h-[70px]'/>
      <h2 className="mt-3 text-display-s text-black">일정 변경 완료!</h2>
      <p className="mt-3 text-body-l text-gray-800">
        일정 변경한 이유를 알려주시면<br />
        앞으로 우리집 운영이 더 꼼꼼해져요!
      </p>

      <div className="mt-12 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="h-12 rounded-lg bg-gray-200 text-gray-600 text-body-m-bold"
          onClick={onClose}
        >
          닫기
        </button>
        <button
          type="button"
          className="h-12 rounded-lg bg-primary text-white text-body-m-bold"
          onClick={() => {
            onClose();
            navigate('/calendar/reason');
          }}
        >
          이유 선택하기
        </button>
      </div>
    </div>
  );
}
