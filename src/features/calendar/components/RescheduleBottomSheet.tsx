/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import ImgAlarm from '@/assets/calendar/img-alram.png';
import { useNavigate } from 'react-router-dom';
import type { MyTaskWeekItem } from '../types/task.types';
import { postponeMyTask } from '../api/myTaskEditApi';

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

// 한국시간 표시
type TimeValue = { ampm: '오전' | '오후'; hour: number; minute: number };

function formatKoreanTime(t: TimeValue) {
  const hh = String(t.hour).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${t.ampm} ${hh}:${mm}`;
}

// ---------- date/time utils ----------
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toHHmm = (t: TimeValue) => {
  let h = t.hour % 12;
  if (t.ampm === '오후') h += 12;
  if (t.ampm === '오전' && t.hour === 12) h = 0;
  const hh = String(h).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${hh}:${mm}`;
};

// task.time("HH:mm") → TimeValue(오전/오후)
const parseHHmmToKorean = (time?: string | null): TimeValue => {
  if (!time) return { ampm: '오전', hour: 12, minute: 0 };
  const [hh, mm] = time.split(':').map(Number);
  const ampm: '오전' | '오후' = hh >= 12 ? '오후' : '오전';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return { ampm, hour: hour12, minute: mm };
};

// ---------- WheelPicker (공통) ----------
type WheelPickerProps<T extends string | number> = {
  items: T[];
  value: T;
  onChange: (v: T) => void;
  itemHeight?: number; // 한 줄 높이
  visibleCount?: number; // 보이는 줄 수 (홀수)
  renderItem?: (v: T) => React.ReactNode;
};

function WheelPicker<T extends string | number>({
  items,
  value,
  onChange,
  itemHeight = 40,
  visibleCount = 5,
  renderItem,
}: WheelPickerProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const half = Math.floor(visibleCount / 2);
  const containerHeight = itemHeight * visibleCount;

  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = items.findIndex((x) => x === value);
    return Math.max(0, idx);
  });

  const programmaticRef = useRef(false);

  const valueIndex = useMemo(() => {
    const idx = items.findIndex((x) => x === value);
    return Math.max(0, idx);
  }, [items, value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    programmaticRef.current = true;
    el.scrollTo({ top: valueIndex * itemHeight, behavior: 'auto' });
    setActiveIndex(valueIndex);

    const t = window.setTimeout(() => {
      programmaticRef.current = false;
    }, 0);

    return () => window.clearTimeout(t);
  }, [valueIndex, itemHeight]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: number | null = null;

    const settle = () => {
      const idx = Math.round(el.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));

      programmaticRef.current = true;
      el.scrollTo({ top: clamped * itemHeight, behavior: 'smooth' });
      setActiveIndex(clamped);

      onChange(items[clamped]);

      window.setTimeout(() => {
        programmaticRef.current = false;
      }, 120);
    };

    const onScroll = () => {
      if (programmaticRef.current) return;

      const idx = Math.round(el.scrollTop / itemHeight);
      setActiveIndex(Math.max(0, Math.min(items.length - 1, idx)));

      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(settle, 80);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, [items, itemHeight, onChange]);

  const spacer = half * itemHeight;

  return (
    <div className="relative w-20">
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{ top: containerHeight / 2 - itemHeight / 2, height: itemHeight }}
      />

      <div
        ref={ref}
        className="overflow-y-scroll scrollbar-hide snap-y snap-mandatory overscroll-contain"
        style={{
          height: containerHeight,
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ height: spacer }} />

        {items.map((it, idx) => {
          const dist = Math.abs(idx - activeIndex);
          const textClass =
            dist === 0 ? 'text-gray-900' : dist === 1 ? 'text-gray-500' : 'text-gray-300';

          return (
            <div
              key={`${String(it)}-${idx}`}
              className={`snap-center flex items-center justify-center text-body-m-bold ${textClass}`}
              style={{ height: itemHeight }}
              onClick={() => onChange(it)}
              role="button"
              tabIndex={0}
            >
              {renderItem ? renderItem(it) : String(it)}
            </div>
          );
        })}

        <div style={{ height: spacer }} />
      </div>
    </div>
  );
}

// ---------- Flow ----------
type Step = 'FORM' | 'CALENDAR' | 'TIME' | 'DONE';

type Props = {
  open: boolean;
  onClose: () => void;
  task: MyTaskWeekItem | null;
  initialDate?: Date | null;
  calendarCtaLabel?: string;
  onUpdated?: () => void;
};

export default function RescheduleFlowBottomSheet({
  open,
  onClose,
  task,
  initialDate = null,
  calendarCtaLabel = '변경하기',
  onUpdated,
}: Props) {
  const [step, setStep] = useState<Step>('FORM');
  const navigate = useNavigate();

  const baseDate = initialDate ?? new Date(); // fallback

  const [viewYear, setViewYear] = useState<number>(baseDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(baseDate.getMonth() + 1);

  const [pickedDate, setPickedDate] = useState<Date | null>(initialDate);
  const [pickedTime, setPickedTime] = useState<TimeValue>(() => parseHHmmToKorean(task?.time));

  const [pending, setPending] = useState(false);

  const STEP_HEIGHT: Record<Step, string> = {
    FORM: '318px',
    CALENDAR: '423px',
    TIME: '399px',
    DONE: '345px',
  };
  const height = STEP_HEIGHT[step];

  // 최초(바텀시트 진입 시점) 값 보관용
  const [fromDate, setFromDate] = useState<string>('');
  const [fromTime, setFromTime] = useState<string>('');

  useEffect(() => {
    if (!open) return;

    setPending(false);
    setStep('FORM');

    const d = initialDate ?? new Date();
    setPickedDate(d);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth() + 1);

    setPickedTime(parseHHmmToKorean(task?.time));

    // 최초로 받아온 값 저장
    setFromDate(toYMD(d));
    setFromTime(task?.time ?? '');
  }, [open, initialDate, task]);

  // 이유 선택 페이지로 이동 (date/time + from 값 같이 넘김)
  const submitWithCurrent = async (next: { date: Date; time: TimeValue }) => {
    if (!task) return;

    try {
      setPending(true);

      onUpdated?.();
      onClose();

      navigate('/calendar/reason', {
        state: {
          occurrenceId: task.occurrenceId,

          taskName: task.taskName,    
          categoryType: task.category,   

          // 변경 전(최초)
          fromDate,
          fromTime,

          // 변경 후
          toDate: toYMD(next.date),
          toTime: toHHmm(next.time),
        },
      });
    } catch (e) {
      console.error('이동 실패:', e);
    } finally {
      setPending(false);
    }
  };

  // 날짜 변경
  const handleSubmitDate = async () => {
    if (!task || !pickedDate) return;

    const next = { date: pickedDate, time: pickedTime };

    try {
      setPending(true);
      await postponeMyTask(task.occurrenceId, {
        date: toYMD(next.date),
        time: toHHmm(next.time),
        postponeReasonCode: null,
        postponeReasonText: null,
      });
      await submitWithCurrent(next);
    } catch (e) {
      console.error('날짜 변경 실패:', e);
    } finally {
      setPending(false);
    }
  };

  // 시간 변경
  const handleSubmitTime = async (nextTime: TimeValue) => {
    if (!task) return;

    const d = pickedDate ?? baseDate;
    const next = { date: d, time: nextTime };

    try {
      setPending(true);
      await postponeMyTask(task.occurrenceId, {
        date: toYMD(next.date),
        time: toHHmm(next.time),
        postponeReasonCode: null,
        postponeReasonText: null,
      });
      await submitWithCurrent(next);
    } catch (e) {
      console.error('시간 변경 실패:', e);
    } finally {
      setPending(false);
    }
  };

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
          pickedTime={pickedTime}
          onOpenCalendar={() => setStep('CALENDAR')}
          onOpenTime={() => setStep('TIME')}
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
          pending={pending}
          onConfirm={handleSubmitDate}
        />
      )}

      {step === 'TIME' && (
        <TimeStep
          value={pickedTime}
          onBack={() => setStep('FORM')}
          pending={pending}
          onConfirm={async (v) => {
            setPickedTime(v);
            await handleSubmitTime(v);
          }}
        />
      )}

      {step === 'DONE' && <DoneStep onClose={onClose} />}
    </BottomSheet>
  );
}

// ---------- Step 1 ----------
function FormStep({
  pickedDate,
  pickedTime,
  onOpenCalendar,
  onOpenTime,
}: {
  pickedDate: Date | null;
  pickedTime: TimeValue;
  onOpenCalendar: () => void;
  onOpenTime: () => void;
}) {
  return (
    <div className="px-2 pt-3">
      <h2 className="text-body-l-bold text-gray-900 text-center">일정 변경하기</h2>
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
            onClick={onOpenTime}
          >
            <p className="text-body-m-bold text-gray-900">{formatKoreanTime(pickedTime)}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Step 2 ----------
function CalendarStep({
  viewYear,
  viewMonth,
  setViewYear,
  setViewMonth,
  pickedDate,
  setPickedDate,
  ctaLabel,
  onConfirm,
  pending,
}: {
  viewYear: number;
  viewMonth: number;
  setViewYear: (y: number) => void;
  setViewMonth: (m: number) => void;

  pickedDate: Date | null;
  setPickedDate: (d: Date) => void;

  ctaLabel: string;
  onConfirm: () => void;
  pending: boolean;
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

        <div className="text-center mt-4 grid grid-cols-7 text-label-l text-gray-500">
          {weekdays.map((w) => (
            <div key={w} className="py-2">{w}</div>
          ))}
        </div>

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

      <div className="px-6 pt-6">
        <BottomCTAWrapper fixed showTopBorder>
          <BottomCTAButton
            label={ctaLabel}
            disabled={!pickedDate || pending}
            onClick={onConfirm}
          />
        </BottomCTAWrapper>
      </div>
    </div>
  );
}

// ---------- Done ----------
function DoneStep({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-10 pb-8">
      <img src={ImgAlarm} className="-mx-3 w-[70px] h-[70px]" />
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

// ---------- Time ----------
function TimeStep({
  value,
  onBack,
  onConfirm,
  pending,
}: {
  value: TimeValue;
  onBack: () => void;
  onConfirm: (v: TimeValue) => void | Promise<void>;
  pending: boolean;
}) {
  const [local, setLocal] = useState<TimeValue>(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => [0, 10, 20, 30, 40, 50], []);

  return (
    <div className="px-5 pt-4 pb-24">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 h-10 w-10 flex items-center justify-center"
          aria-label="뒤로"
        >
          ←
        </button>
        <h2 className="text-body-l-bold text-gray-900">시간 선택</h2>
      </div>

      <div className="mt-6">
        <div className="relative rounded-2xl bg-white py-6">
          <div className="pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 h-12 rounded-xl bg-gray-100" />

          <div className="grid grid-cols-3 text-center">
            <div className="flex items-center justify-center">
              <WheelPicker
                items={['오전', '오후'] as const}
                value={local.ampm}
                onChange={(v) => setLocal((p) => ({ ...p, ampm: v }))}
                itemHeight={40}
                visibleCount={5}
              />
            </div>

            <div className="flex items-center justify-center">
              <WheelPicker
                items={hours}
                value={local.hour}
                onChange={(v) => setLocal((p) => ({ ...p, hour: v }))}
                itemHeight={40}
                visibleCount={5}
                renderItem={(h) => String(h).padStart(2, '0')}
              />
            </div>

            <div className="flex items-center justify-center">
              <WheelPicker
                items={minutes}
                value={local.minute}
                onChange={(v) => setLocal((p) => ({ ...p, minute: v }))}
                itemHeight={40}
                visibleCount={5}
                renderItem={(m) => String(m).padStart(2, '0')}
              />
            </div>
          </div>
        </div>
      </div>

      <BottomCTAWrapper fixed showTopBorder>
        <BottomCTAButton
          label="설정하기"
          disabled={pending}
          onClick={() => onConfirm(local)}
        />
      </BottomCTAWrapper>
    </div>
  );
}
