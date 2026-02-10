/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import Header from '@/shared/components/Header';
import Imgcoin from '@/assets/todo/icon-coin.svg';
import ImgStar from '@/assets/todo/icon-star.svg';
import ImgStarFill from '@/assets/todo/icon-star-fill.svg';
import type { MyTaskWeekItem } from '@/features/calendar/types/task.types';
import type { GroupMember } from '@/shared/group/groupMembers.types';
import { useTaskDraftStore } from '@/features/todo/stores/useTaskDraftStore';
import { useUserStore } from '@/features/auth/stores/useUserStore';

// store 타입(assignee 구조 맞추기)
import type { DraftAssignee } from '@/features/todo/types/draftTask.types';
import { getGroupMembers } from '@/shared/group/groupMemberApi';

// ---------- Calendar UI utils ----------
function getCalendarCells(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const firstWeekday = firstDayOfMonth.getDay(); // 0~6
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  const cells: { day: number; isCurrentMonth: boolean }[] = [];

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

function formatKoreanDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${y}년 ${m}월 ${d}일`;
}

function formatKoreanTime(timeStr: string) {
  const [hh, mm] = timeStr.split(':').map(Number);
  if (hh === undefined || mm === undefined) return timeStr;

  const ampm = hh < 12 ? '오전' : '오후';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${ampm} ${hour12}:${String(mm).padStart(2, '0')}`;
}

function parseTimeToPicked(time: string) {
  // "HH:mm"
  const [hh, mm] = time.split(':').map(Number);
  const ampm: '오전' | '오후' = hh < 12 ? '오전' : '오후';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return { ampm, hour: hour12, minute: mm ?? 0 };
}

// ---------- WheelPicker (공통) ----------
type WheelPickerProps<T extends string | number> = {
  items: T[];
  value: T;
  onChange: (v: T) => void;
  itemHeight?: number;
  visibleCount?: number;
  renderItem?: (v: T) => React.ReactNode;
};

function WheelPicker<T extends string | number>({
  items,
  value,
  onChange,
  itemHeight = 20,
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
type Step = 'FORM' | 'CALENDAR' | 'TIME' | 'ASSIGNEE';

type Props = {
  draftId: string;
  open: boolean;
  onClose: () => void;
  task?: MyTaskWeekItem | null;
  initialDate?: Date | null;
  calendarCtaLabel?: string;
};

export default function EditDraftFlowBottomSheet({
  draftId,
  open,
  onClose,
  initialDate = null,
  calendarCtaLabel = '변경하기',
}: Props) {
  const [step, setStep] = useState<Step>('FORM');

  const [viewYear, setViewYear] = useState((initialDate ?? new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState((initialDate ?? new Date()).getMonth() + 1);

  const [pickedDate, setPickedDate] = useState<Date | null>(initialDate);

  // 시간 (UI용)
  const [pickedTime, setPickedTime] = useState({
    ampm: '오전' as '오전' | '오후',
    hour: 11,
    minute: 0,
  });


  // 담당자 (UI용) 
  const [assignee, setAssignee] = useState<DraftAssignee | null>(null);
  //  그룹 멤버 목록 
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // 그룹 아이디 
  const groupId = useUserStore((s) => s.profile?.groupId ?? null);


  const draft = useTaskDraftStore((s) => s.drafts.find((d) => d.draftId === draftId));
  const updateDraft = useTaskDraftStore((s) => s.updateDraft);

  useEffect(() => {
    if (!open) return;
    setStep('FORM');
    if (!draft) return;

    // 날짜
    if (draft.date) {
      const [y, m, d] = draft.date.split('-').map(Number);
      const nextDate = new Date(y, m - 1, d);
      setPickedDate(nextDate);
      setViewYear(nextDate.getFullYear());
      setViewMonth(nextDate.getMonth() + 1);
    } else {
      setPickedDate(initialDate);
      const base = initialDate ?? new Date();
      setViewYear(base.getFullYear());
      setViewMonth(base.getMonth() + 1);
    }

    // 시간
    if (draft.time) setPickedTime(parseTimeToPicked(draft.time));
    else setPickedTime({ ampm: '오전', hour: 11, minute: 0 });

    // ✅ 담당자: store.assignee를 그대로 UI에 세팅
    setAssignee(draft.assignee ?? null);
  }, [open, draftId, draft, initialDate]);

  useEffect(() => {
  if (!open) return;
  if (step !== 'ASSIGNEE') return;
  if (!groupId) return;

  let alive = true;

  (async () => {
    try {
      setMembersLoading(true);
      const data = await getGroupMembers(groupId);

      if (!alive) return;

      if (!data.isSuccess) {
        setMembers([]);
        return;
      }

      setMembers(data.result.members ?? []);
    } finally {
      if (alive) setMembersLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, [open, step, groupId]);


  

  const STEP_HEIGHT: Record<Step, string> = {
    FORM: 'calc(100dvh - 10px)',
    CALENDAR: '423px',
    TIME: '360px',
    ASSIGNEE: '485px',
  };

  type PickedTime = { ampm: '오전' | '오후'; hour: number; minute: number };

  const buildTimeString = (v: PickedTime) => {
    const hour24 =
      v.ampm === '오후'
        ? v.hour === 12
          ? 12
          : v.hour + 12
        : v.hour === 12
          ? 0
          : v.hour;

    const hh = String(hour24).padStart(2, '0');
    const mm = String(v.minute).padStart(2, '0');
    return `${hh}:${mm}`;
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
      className={['px-0', 'max-h-[calc(100dvh-10px)]'].join(' ')}
      contentClassName="px-0 pt-0"
    >
      {step === 'FORM' && (
        <FormStep
          draftId={draftId}
          onOpenCalendar={() => setStep('CALENDAR')}
          onOpenTime={() => setStep('TIME')}
          onOpenAssignee={() => setStep('ASSIGNEE')}
          onSave={onClose}
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
          onConfirm={(date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            updateDraft(draftId, { date: `${yyyy}-${mm}-${dd}` });
            setStep('FORM');
          }}
        />
      )}

      {step === 'TIME' && (
        <TimeStep
          value={pickedTime}
          onConfirm={(v) => {
            setPickedTime(v);
            updateDraft(draftId, { time: buildTimeString(v) });
            setStep('FORM');
          }}
        />
      )}

      {step === 'ASSIGNEE' && (
        <AssigneeStep
          members={members}
          selectedId={assignee?.memberId ?? null}
          loading={membersLoading}
          onConfirm={(m) => {
            const next: DraftAssignee = {
              memberId: m.memberId,
              nickname: m.nickname,
              profileImageUrl: m.profileImageUrl ?? null,
            };
            setAssignee(next);
            updateDraft(draftId, { assignee: next });
            setStep('FORM');
          }}
        />
      )}
    </BottomSheet>
  );
}

// ---------- Step 1: (UI) 편집 폼 ----------
function FormStep({
  draftId,
  onOpenCalendar,
  onOpenTime,
  onOpenAssignee,
  onSave,
}: {
  draftId: string;
  onOpenCalendar: () => void;
  onOpenTime: () => void;
  onOpenAssignee: () => void;
  onSave: () => void;
}) {
  const draft = useTaskDraftStore((s) => s.drafts.find((d) => d.draftId === draftId));
  const updateDraft = useTaskDraftStore((s) => s.updateDraft);

  if (!draft) return null;

  const dateLabel = draft.date ? formatKoreanDate(draft.date) : '날짜를 선택해주세요';
  const timeLabel = draft.time ? formatKoreanTime(draft.time) : '시간을 선택해주세요';

  // assignee label
  const assigneeLabel = draft.assignee?.nickname ?? '담당자를 선택해주세요';
  const assigneeAvatar = draft.assignee?.profileImageUrl ?? null;

  // repeatOn: repeat.enabled 기반 (요구사항: enabled=false면 repeat 자체 undefine고 ui 안보여줌
  const repeatOn = !!draft.repeat?.enabled;

  const WEEKDAYS = [
    { key: 'SUN', label: '일' },
    { key: 'MON', label: '월' },
    { key: 'TUE', label: '화' },
    { key: 'WED', label: '수' },
    { key: 'THU', label: '목' },
    { key: 'FRI', label: '금' },
    { key: 'SAT', label: '토' },
  ] as const;

  type WeekdayKey = (typeof WEEKDAYS)[number]['key'];

  // 선택된 요일들: repeat.daysOfWeek (없으면 [])
  const selectedDays: WeekdayKey[] = (draft.repeat?.daysOfWeek ?? []) as WeekdayKey[];

  // 반복 스위치 토글: OFF면 repeat 제거(=undefined)
  const handleToggleRepeat = () => {
    if (repeatOn) {
      updateDraft(draftId, { repeat: undefined }); // enabled=false일 때 repeat 자체 없음
    } else {
      updateDraft(draftId, { repeat: { enabled: true, daysOfWeek: [] } });
    }
  };

  // 요일 토글: repeat.daysOfWeek 배열 add/remove
  const toggleDay = (day: WeekdayKey) => {
    const prev = draft.repeat?.daysOfWeek ?? [];
    const exists = prev.includes(day);
    const nextDays = exists ? prev.filter((d) => d !== day) : [...prev, day];

    updateDraft(draftId, {
      repeat: { enabled: true, daysOfWeek: nextDays },
    });
  };

  return (
    <div className="pb-24">
      <Header title={draft.taskName} showBackButton />

      {/* 업무 목록 */}
      <div className="mt-9 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">업무 목록</p>

        <div className="w-full rounded-xl border border-gray-300 bg-[#FAFAFA] px-3 py-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary-50 flex items-center justify-center">
            <div className="h-8 w-8 rounded-md bg-primary/20" />
          </div>

          <div className="flex-1">
            <p className="text-body-m-bold text-gray-700">{draft.taskName}</p>
            <div className="mt-1 flex items-center gap-1.5 text-body-s text-gray-500">
              <img src={Imgcoin} alt="" className="w-4 h-4" />
              <span>{draft.point} 포인트</span>
            </div>
          </div>

          {/* 즐겨찾기(별) */}
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center"
            aria-label={draft.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
            onClick={() => updateDraft(draftId, { isFavorite: !draft.isFavorite })}
          >
            <img src={draft.isFavorite ? ImgStarFill : ImgStar} alt="" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 일시 */}
      <div className="mt-5 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">일시</p>
        <button
          type="button"
          className="w-full rounded-xl border border-gray-300 bg-[#FAFAFA] px-4 py-4 text-left"
          onClick={onOpenCalendar}
        >
          <p className="text-body-m-bold text-gray-800">{dateLabel}</p>
        </button>
      </div>

      {/* 시간 */}
      <div className="mt-4 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">시간</p>
        <button
          type="button"
          className="w-full rounded-xl border border-gray-300 bg-[#FAFAFA] px-4 py-4 text-left"
          onClick={onOpenTime}
        >
          <p className="text-body-m-bold text-gray-800">{timeLabel}</p>
        </button>
      </div>

      {/* 반복 */}
      <div className="mt-4 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">반복</p>

        <div className="w-full rounded-xl bg-white">
          <div className="flex items-center justify-between">
            <p className="text-body-m-bold text-gray-800">반복 주기 설정</p>

            <button
              type="button"
              onClick={handleToggleRepeat}
              className={[
                'relative w-12 h-7 rounded-full transition-colors',
                repeatOn ? 'bg-primary' : 'bg-gray-200',
              ].join(' ')}
              aria-pressed={repeatOn}
              aria-label="반복 주기 설정"
            >
              <span
                className={[
                  'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform',
                  repeatOn ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>

          {repeatOn && (
            <div className="mt-4">
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((w) => {
                  const active = selectedDays.includes(w.key);
                  return (
                    <button
                      key={w.key}
                      type="button"
                      onClick={() => toggleDay(w.key)}
                      className={[
                        'h-16 rounded-lg text-body-l-bold transition-colors',
                        active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800',
                      ].join(' ')}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 담당자 */}
      <div className="mt-4 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">담당자</p>

        <button
          type="button"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 flex items-center gap-3"
          onClick={onOpenAssignee}
        >
        <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
            {assigneeAvatar ? (
              <img
                src={assigneeAvatar}
                alt={assigneeLabel}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">👤</div>
            )}
          </div>          
          <p className="text-body-m-bold text-gray-800">{assigneeLabel}</p>
        </button>
      </div>

      <BottomCTAWrapper fixed showTopBorder>
        <BottomCTAButton label="저장하기" onClick={onSave} />
      </BottomCTAWrapper>
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
  onConfirm: (date: Date) => void;
}) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const selectedDay =
    pickedDate && pickedDate.getFullYear() === viewYear && pickedDate.getMonth() === viewMonth - 1
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
            <div key={w} className="py-2">
              {w}
            </div>
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
            disabled={!pickedDate}
            onClick={() => pickedDate && onConfirm(pickedDate)}
          />
        </BottomCTAWrapper>
      </div>
    </div>
  );
}

// ---------- Step 4: 시간 고르기 (UI) ----------
export function TimeStep({
  value,
  onConfirm,
}: {
  value: { ampm: '오전' | '오후'; hour: number; minute: number };
  onConfirm: (v: { ampm: '오전' | '오후'; hour: number; minute: number }) => void;
}) {
  const [local, setLocal] = useState(value);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => [0, 10, 20, 30, 40, 50], []);

  return (
    <div className="px-5 pt-4 pb-24">
      <div className="relative flex items-center justify-center">
        <h2 className="text-body-l-bold text-gray-900">시간 선택</h2>
      </div>

      <div className="-mt-8">
        <div className="relative rounded-2xl">
          <div className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 h-12 rounded-xl bg-gray-100" />

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
        <BottomCTAButton label="설정하기" onClick={() => onConfirm(local)} />
      </BottomCTAWrapper>
    </div>
  );
}

// ---------- Step 5: 담당자 고르기 (UI) ----------

function AssigneeStep({
  members,
  selectedId,
  loading,
  onConfirm,
}: {
  members: GroupMember[];
  selectedId: number | null;
  loading?: boolean;
  onConfirm: (m: GroupMember) => void;
}) {
  const [localId, setLocalId] = useState<number | null>(selectedId);

  useEffect(() => {
    setLocalId(selectedId);
  }, [selectedId]);

  const picked = members.find((m) => m.memberId === localId) ?? null;

  return (
    <div className="flex flex-col h-full">
      <Header title="담당자 선택" />

      <div className="mt-5 flex-1 overflow-y-auto px-1 space-y-[8px]">
        {loading ? (
          <div className="text-body-m text-gray-500 px-3 py-2">불러오는 중…</div>
        ) : (
          members.map((m) => {
            const active = m.memberId === localId;
            return (
              <button
                key={m.memberId}
                type="button"
                onClick={() => setLocalId(m.memberId)}
                className={[
                  'w-full flex items-center gap-3 rounded-xl px-3 py-3',
                  active ? 'border border-primary bg-primary-50' : 'bg-white',
                ].join(' ')}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  {m.profileImageUrl ? (
                    <img
                      src={m.profileImageUrl}
                      alt={m.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">👤</div>
                  )}
                </div>

                <span className="text-body-m-bold text-gray-800">{m.nickname}</span>
              </button>
            );
          })
        )}
      </div>

      <BottomCTAWrapper fixed showTopBorder>
        <BottomCTAButton
          label="지정하기"
          disabled={!picked}
          onClick={() => picked && onConfirm(picked)}
        />
      </BottomCTAWrapper>
    </div>
  );
}
