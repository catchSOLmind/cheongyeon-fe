// src/shared/components/EditAllBottomsheet.tsx

import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { WheelPicker } from '@/shared/components/WheelPicker'; // ✅ 공통 WheelPicker
import { getCalendarCells, formatMonthLabel } from '@/shared/utils/calendarUtils'; // ✅ 유틸 분리
import IconDropdown from '@/assets/calendar/icon-dropdown.svg';
import ImgAlarm from '@/assets/calendar/img-alram.png';
import { useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';
import Imgcoin from '@/assets/todo/icon-coin.svg';
import ImgStar from '@/assets/todo/icon-star.svg';
import ImgStarFill from '@/assets/todo/icon-star-fill.svg';

import type { MyTaskWeekItem } from '@/features/calendar/types/task.types';
import type { GroupTaskWeekItem } from '@/features/calendar/types/groupTask.types';
import type { MyTaskDetailResponse } from '@/features/calendar/types/taskDetail.types';
import { getMyTaskDetail } from '@/features/calendar/api/taskDetailApi';
import { getGroupMembers } from '@/shared/group/groupMemberApi';
import type { GroupMember } from '@/shared/group/groupMembers.types';


/** ChoiceReasonPage가 기대하는 state shape */
type CategoryType = MyTaskDetailResponse['taskType']['category'];
type NavState = {
  occurrenceId: number;
  taskName: string;
  categoryType: CategoryType;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
};

function formatKoreanDateFromDate(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatKoreanTimeFromPicked(v: { ampm: '오전' | '오후'; hour: number; minute: number }) {
  return `${v.ampm} ${v.hour}:${String(v.minute).padStart(2, '0')}`;
}

function parseTimeToPicked(time: string) {
  const [hhStr, mmStr] = time.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr ?? '0');
  const ampm: '오전' | '오후' = hh < 12 ? '오전' : '오후';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return { ampm, hour: hour12, minute: mm ?? 0 };
}

// ---------- Flow ----------
type Step = 'FORM' | 'CALENDAR' | 'TIME' | 'ASSIGNEE' | 'DONE';

type Props = {
  open: boolean;
  onClose: () => void;
  task: MyTaskWeekItem | GroupTaskWeekItem | null; // ✅ 둘 다 occurrenceId 있음
  initialDate?: Date | null;
  calendarCtaLabel?: string;
};

type AssigneeUI = { id: number; name: string; avatarUrl?: string | null };
type MemberUI = { id: number; name: string; avatarUrl?: string | null };

export default function EditAllFlowBottomSheet({
  open,
  onClose,
  task,
  initialDate = null,
  calendarCtaLabel = '변경하기',
}: Props) {
  const [step, setStep] = useState<Step>('FORM');
  const [viewYear, setViewYear] = useState((initialDate ?? new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState((initialDate ?? new Date()).getMonth() + 1);
  const [pickedDate, setPickedDate] = useState<Date | null>(initialDate);
  const [pickedTime, setPickedTime] = useState({
    ampm: '오전' as '오전' | '오후',
    hour: 11,
    minute: 0,
  });
  const [assignee, setAssignee] = useState<AssigneeUI | null>(null);
  const [detail, setDetail] = useState<MyTaskDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [members, setMembers] = useState<MemberUI[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // open 시 초기화
  useEffect(() => {
    if (!open) return;
    setStep('FORM');
    setAssignee(null);
    setPickedDate(initialDate);
    const base = initialDate ?? new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth() + 1);
    setDetail(null);
    setDetailLoading(false);
    setMembers([]);
    setMembersLoading(false);
  }, [open, initialDate]);

  // ✅ as any 제거 — MyTaskWeekItem, GroupTaskWeekItem 둘 다 occurrenceId: number 보유
  useEffect(() => {
    if (!open) return;
    const occurrenceId = task?.occurrenceId;
    if (!occurrenceId) return;

    let alive = true;
    (async () => {
      try {
        setDetailLoading(true);
        const res = await getMyTaskDetail(occurrenceId);
        if (!alive) return;
        setDetail(res);
      } catch (e) {
        console.error('[getMyTaskDetail] error:', e);
      } finally {
        if (alive) setDetailLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [open, task?.occurrenceId]); // ✅ as any 제거

  // detail -> UI state 반영
  useEffect(() => {
    if (!open || !detail) return;

    if (detail.date) {
      const [y, m, d] = detail.date.split('-').map(Number);
      const next = new Date(y, m - 1, d);
      setPickedDate(next);
      setViewYear(next.getFullYear());
      setViewMonth(next.getMonth() + 1);
    }
    if (detail.time) {
      setPickedTime(parseTimeToPicked(detail.time));
    }
    if (detail.assignee) {
      setAssignee({
        id: detail.assignee.memberId,
        name: detail.assignee.nickname,
        avatarUrl: detail.assignee.profileImageUrl ?? null,
      });
    } else {
      setAssignee(null);
    }
  }, [open, detail]);

  // detail.groupId -> members fetch
  useEffect(() => {
    if (!open) return;
    const groupId = detail?.groupId;
    if (!groupId) return;

    let alive = true;
    (async () => {
      try {
        setMembersLoading(true);
        const res = await getGroupMembers(groupId);
        if (!alive) return;

        // ✅ as any 제거 — getGroupMembers 반환 타입에 따라 조정
        const list: GroupMember[] = Array.isArray(res) ? res : (res as { result: { members?: GroupMember[] } }).result?.members ?? [];

        setMembers(
          list.map((m) => ({
            id: m.memberId,
            name: m.nickname,
            avatarUrl: m.profileImageUrl ?? null,
          })),
        );
      } catch (e) {
        console.error('[getGroupMembers] error:', e);
        if (alive) setMembers([]);
      } finally {
        if (alive) setMembersLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [open, detail?.groupId]);

  const reasonNavState = useMemo<NavState | null>(() => {
    if (!detail?.occurrenceId) return null;
    return {
      occurrenceId: detail.occurrenceId,
      taskName: detail.taskType?.name ?? '',
      categoryType: detail.taskType?.category,
      fromDate: detail.date,
      fromTime: detail.time ?? '',
      toDate: detail.date,
      toTime: detail.time ?? '',
    };
  }, [detail]);

  const STEP_HEIGHT: Record<Step, string> = {
    FORM: 'calc(100dvh - 10px)',
    CALENDAR: '423px',
    TIME: '360px',
    ASSIGNEE: '485px',
    DONE: '345px',
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={undefined}
      showHeaderDivider={false}
      showHandle={true}
      height={STEP_HEIGHT[step]}
      className={['px-0', 'max-h-[calc(100dvh-10px)]'].join(' ')}
      contentClassName="px-0 pt-0"
    >
      {step === 'FORM' && (
        <FormStep
          pickedDate={pickedDate}
          onOpenCalendar={() => setStep('CALENDAR')}
          onOpenTime={() => setStep('TIME')}
          onOpenAssignee={() => setStep('ASSIGNEE')}
          pickedTime={pickedTime}
          assignee={assignee}
          onSave={() => setStep('DONE')}
          detailLoading={detailLoading}
          taskTitle={detail?.taskType?.name ?? '업무'}
          taskPoint={detail?.taskType?.point ?? null}
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
          onConfirm={() => setStep('FORM')}
        />
      )}
      {step === 'TIME' && (
        <TimeStep
          value={pickedTime}
          onConfirm={(v) => { setPickedTime(v); setStep('FORM'); }}
        />
      )}
      {step === 'ASSIGNEE' && (
        <AssigneeStep
          members={members}
          loading={membersLoading}
          selectedId={assignee?.id ?? null}
          onConfirm={(m) => { setAssignee(m); setStep('FORM'); }}
        />
      )}
      {step === 'DONE' && <DoneStep onClose={onClose} reasonState={reasonNavState} />}
    </BottomSheet>
  );
}

// ---------- Step 1: 편집 폼 ----------
function FormStep({
  pickedDate, onOpenCalendar, onOpenTime, onOpenAssignee,
  pickedTime, assignee, onSave, detailLoading, taskTitle, taskPoint,
}: {
  pickedDate: Date | null;
  onOpenCalendar: () => void;
  onOpenTime: () => void;
  onOpenAssignee: () => void;
  pickedTime: { ampm: '오전' | '오후'; hour: number; minute: number };
  assignee: { id: number; name: string; avatarUrl?: string | null } | null;
  onSave: () => void;
  detailLoading: boolean;
  taskTitle: string;
  taskPoint: number | null;
}) {
  const [repeatOn, setRepeatOn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const WEEKDAYS = [
    { key: 'SUN', label: '일' }, { key: 'MON', label: '월' },
    { key: 'TUE', label: '화' }, { key: 'WED', label: '수' },
    { key: 'THU', label: '목' }, { key: 'FRI', label: '금' },
    { key: 'SAT', label: '토' },
  ] as const;

  type WeekdayKey = (typeof WEEKDAYS)[number]['key'];
  const [selectedDays, setSelectedDays] = useState<WeekdayKey[]>(['FRI']);

  const toggleDay = (day: WeekdayKey) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const dateLabel = pickedDate ? formatKoreanDateFromDate(pickedDate) : '날짜를 선택해주세요';
  const timeLabel = formatKoreanTimeFromPicked(pickedTime);

  return (
    <div className="pb-24">
      <Header title={taskTitle} showBackButton />
      {detailLoading && <div className="px-5 pt-2 text-body-s text-gray-400">상세 불러오는 중...</div>}

      <div className="mt-9 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">업무 목록</p>
        <div className="w-full rounded-xl border border-gray-300 bg-[#FAFAFA] px-3 py-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary-50 flex items-center justify-center">
            <div className="h-8 w-8 rounded-md bg-primary/20" />
          </div>
          <div className="flex-1">
            <p className="text-body-m-bold text-gray-700">{taskTitle}</p>
            <div className="mt-1 flex items-center gap-1.5 text-body-s text-gray-500">
              <img src={Imgcoin} alt="" className="w-4 h-4" />
              <span>{taskPoint ?? 0} 포인트</span>
            </div>
          </div>
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center"
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
            onClick={() => setIsFavorite((v) => !v)}
          >
            <img src={isFavorite ? ImgStarFill : ImgStar} alt="" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="mt-5 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">일시</p>
        <button type="button" className="w-full rounded-xl border border-gray-300 bg-[#FAFAFA] px-4 py-4 text-left" onClick={onOpenCalendar}>
          <p className="text-body-m-bold text-gray-800">{dateLabel}</p>
        </button>
      </div>

      <div className="mt-4 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">시간</p>
        <button type="button" className="w-full rounded-xl border border-gray-300 bg-[#FAFAFA] px-4 py-4 text-left" onClick={onOpenTime}>
          <p className="text-body-m-bold text-gray-800">{timeLabel}</p>
        </button>
      </div>

      <div className="mt-4 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">반복</p>
        <div className="w-full rounded-xl bg-white">
          <div className="flex items-center justify-between">
            <p className="text-body-m-bold text-gray-800">반복 주기 설정</p>
            <button
              type="button"
              onClick={() => setRepeatOn((v) => { const next = !v; if (next && selectedDays.length === 0) setSelectedDays(['FRI']); return next; })}
              className={['relative w-12 h-7 rounded-full transition-colors', repeatOn ? 'bg-primary' : 'bg-gray-200'].join(' ')}
              aria-pressed={repeatOn}
              aria-label="반복 주기 설정"
            >
              <span className={['absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform', repeatOn ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
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
                      className={['h-16 rounded-lg text-body-l-bold transition-colors', active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'].join(' ')}
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

      <div className="mt-4 px-3">
        <p className="text-label-m text-gray-600 mb-[10px]">담당자</p>
        <button type="button" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 flex items-center gap-3" onClick={onOpenAssignee}>
          <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {assignee?.avatarUrl
              ? <img src={assignee.avatarUrl} alt={assignee.name} className="w-full h-full object-cover" />
              : '👤'}
          </div>
          <p className="text-body-m-bold text-gray-800">{assignee?.name ?? '담당자를 선택해주세요'}</p>
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
  viewYear, viewMonth, setViewYear, setViewMonth,
  pickedDate, setPickedDate, ctaLabel, onConfirm,
}: {
  viewYear: number; viewMonth: number;
  setViewYear: (y: number) => void; setViewMonth: (m: number) => void;
  pickedDate: Date | null; setPickedDate: (d: Date) => void;
  ctaLabel: string; onConfirm: () => void;
}) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]); // ✅ 유틸 사용

  const selectedDay =
    pickedDate && pickedDate.getFullYear() === viewYear && pickedDate.getMonth() === viewMonth - 1
      ? pickedDate.getDate() : null;

  const handlePickDay = (day: number) => setPickedDate(new Date(viewYear, viewMonth - 1, day));

  const handlePrev = () => {
    const prev = new Date(viewYear, viewMonth - 2, 1);
    setViewYear(prev.getFullYear()); setViewMonth(prev.getMonth() + 1);
  };
  const handleNext = () => {
    const next = new Date(viewYear, viewMonth, 1);
    setViewYear(next.getFullYear()); setViewMonth(next.getMonth() + 1);
  };

  return (
    <div className="px-0">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <button type="button" className="flex items-center gap-1 text-display-m text-[#262626]">
            {formatMonthLabel(viewYear, viewMonth)} {/* ✅ 유틸 사용 */}
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
          {weekdays.map((w) => <div key={w} className="py-2">{w}</div>)}
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
                className={['h-12 flex items-center justify-center text-body-l-bold', cell.isCurrentMonth ? (isSelected ? 'text-primary' : 'text-gray-800') : 'text-gray-800'].join(' ')}
              >
                <span className={['w-10 h-10 rounded-full flex items-center justify-center', isSelected ? 'bg-primary-50' : 'bg-transparent'].join(' ')}>
                  {cell.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-6 pt-6">
        <BottomCTAWrapper fixed showTopBorder>
          <BottomCTAButton label={ctaLabel} disabled={!pickedDate} onClick={onConfirm} />
        </BottomCTAWrapper>
      </div>
    </div>
  );
}

// ---------- Step 3: 완료 ----------
function DoneStep({ onClose, reasonState }: { onClose: () => void; reasonState: NavState | null }) {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-10 pb-8">
      <img src={ImgAlarm} className="-mx-3 w-[70px] h-[70px]" alt="" />
      <h2 className="mt-3 text-display-s text-black">일정 변경 완료!</h2>
      <p className="mt-3 text-body-l text-gray-800">일정 변경한 이유를 알려주시면<br />앞으로 우리집 운영이 더 꼼꼼해져요!</p>
      <div className="mt-12 grid grid-cols-2 gap-2">
        <button type="button" className="h-12 rounded-lg bg-gray-200 text-gray-600 text-body-m-bold" onClick={onClose}>닫기</button>
        <button
          type="button"
          className="h-12 rounded-lg bg-primary text-white text-body-m-bold"
          onClick={() => { onClose(); navigate(reasonState?.occurrenceId ? '/calendar/reason' : '/calendar', { state: reasonState ?? undefined }); }}
        >
          이유 선택하기
        </button>
      </div>
    </div>
  );
}

// ---------- Step 4: 시간 ----------
function TimeStep({
  value, onConfirm,
}: {
  value: { ampm: '오전' | '오후'; hour: number; minute: number };
  onConfirm: (v: { ampm: '오전' | '오후'; hour: number; minute: number }) => void;
}) {
  const [local, setLocal] = useState(value);
  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => [0, 10, 20, 30, 40, 50], []);

  useEffect(() => { setLocal(value); }, [value]);

  return (
    <div className="px-5 pt-4 pb-24">
      <div className="relative flex items-center justify-center">
        <h2 className="text-body-l-bold text-gray-900">시간 선택</h2>
      </div>
      <div className="mt-4">
        <div className="relative rounded-2xl">
          <div className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 h-12 rounded-xl bg-gray-100" />
          <div className="grid grid-cols-3 text-center">
            <div className="flex items-center justify-center">
              <WheelPicker items={['오전', '오후'] as const} value={local.ampm} onChange={(v) => setLocal((p) => ({ ...p, ampm: v }))} itemHeight={40} visibleCount={5} />
            </div>
            <div className="flex items-center justify-center">
              <WheelPicker items={hours} value={local.hour} onChange={(v) => setLocal((p) => ({ ...p, hour: v }))} itemHeight={40} visibleCount={5} renderItem={(h) => String(h).padStart(2, '0')} />
            </div>
            <div className="flex items-center justify-center">
              <WheelPicker items={minutes} value={local.minute} onChange={(v) => setLocal((p) => ({ ...p, minute: v }))} itemHeight={40} visibleCount={5} renderItem={(m) => String(m).padStart(2, '0')} />
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

// ---------- Step 5: 담당자 ----------
function AssigneeStep({
  members, loading, selectedId, onConfirm,
}: {
  members: MemberUI[]; loading: boolean;
  selectedId: number | null; onConfirm: (m: MemberUI) => void;
}) {
  const [localId, setLocalId] = useState<number | null>(selectedId);
  useEffect(() => { setLocalId(selectedId); }, [selectedId]);
  const picked = members.find((m) => m.id === localId) ?? null;

  return (
    <div className="flex flex-col h-full">
      <Header title="담당자 선택" />
      {loading && <div className="px-5 pt-3 text-body-s text-gray-400">멤버 불러오는 중...</div>}
      <div className="mt-5 flex-1 overflow-y-auto px-1 space-y-[8px]">
        {members.map((m) => {
          const active = m.id === localId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setLocalId(m.id)}
              className={['w-full flex items-center gap-3 rounded-xl px-3 py-3', active ? 'border border-primary bg-primary-50' : 'bg-white'].join(' ')}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                {m.avatarUrl ? <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" /> : '👤'}
              </div>
              <span className="text-body-m-bold text-gray-800">{m.name}</span>
            </button>
          );
        })}
      </div>
      <BottomCTAWrapper fixed showTopBorder>
        <BottomCTAButton label="지정하기" disabled={!picked} onClick={() => picked && onConfirm(picked)} />
      </BottomCTAWrapper>
    </div>
  );
}