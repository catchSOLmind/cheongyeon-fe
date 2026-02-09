import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/shared/components/Header';
import PlaceholderImg from '@/assets/common/img-default-profile.svg';
import { useUserStore } from '@/features/auth/stores/useUserStore';

import CalendarBottomSheet from '@/shared/components/CalendarBottomSheet';
import TimeWheelBottomSheet from '@/shared/components/TimewheelBottomsheet';
import type { TimeValue } from '@/shared/utils/Timeutils';
import PaySelectBottomSheet from '@/features/eraser/components/PaySelectBottomSheet';


// 결제 UI 계산을 위해 메타 포함 (앞 단계에서 반드시 넘겨줘야 값이 살아있음)
type Reservation = {
  suggestionTaskId: number;
  optionId: number;

  count: number;
  estimatedMinutes: number;
  price: number;

  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm (24h)
};

type UiItem = {
  suggestionTaskId: number;
  title: string;
  imgUrl: string | null;
};

type LocationState = {
  usedPoint?: number;
  reservations?: Reservation[];
  items?: UiItem[];
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getKoreanDayName(d: Date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'] as const;
  return days[d.getDay()];
}

/** YYYY-MM-DD -> "2.11(수)" */
function formatVisitDateLabel(iso: string) {
  const [y, m, d] = iso.split('-').map((x) => Number(x));
  const date = new Date(y, m - 1, d);
  return `${m}.${d}(${getKoreanDayName(date)})`;
}

/** "HH:mm" -> "15:30" */
function formatVisitTimeLabel(start: string) {
  return start;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map((x) => Number(x));
  return new Date(y, m - 1, d);
}

function dateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hhmmToTimeValue(hhmm: string): TimeValue {
  const [hhStr, mmStr] = hhmm.split(':');
  const hh24 = Number(hhStr);
  const minute = Number(mmStr);

  const ampm: TimeValue['ampm'] = hh24 >= 12 ? '오후' : '오전';
  const hour12Raw = hh24 % 12;
  const hour = hour12Raw === 0 ? 12 : hour12Raw;

  return { ampm, hour, minute };
}

function timeValueToHHMM(t: TimeValue): string {
  let hour = t.hour % 12;
  if (t.ampm === '오후') hour += 12;
  const hh = String(hour).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${hh}:${mm}`;
}

function SectionRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-display-s text-gray-900">{value}</p>
        <p className="mt-1 text-body-m text-gray-600">{label}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className="h-10 min-w-[64px] rounded-full border border-gray-200 px-5 text-body-l text-black bg-white"
      >
        변경
      </button>
    </div>
  );
}

function ReservationCard({
  title,
  imgUrl,
  visitDate,
  visitTime,
  open,
  onToggle,
  onChangeDate,
  onChangeTime,
}: {
  title: string;
  imgUrl: string | null;
  visitDate: string;
  visitTime: string;
  open: boolean;
  onToggle: () => void;
  onChangeDate?: () => void;
  onChangeTime?: () => void;
}) {
  const dateLabel = formatVisitDateLabel(visitDate);
  const timeLabel = formatVisitTimeLabel(visitTime);

  return (
    <div className="bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={imgUrl ?? PlaceholderImg}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PlaceholderImg;
              }}
            />
          </div>
          <p className="text-body-m-bold text-black">{title}</p>
        </div>

        <div className="text-gray-700">
          <Chevron open={open} />
        </div>
      </button>

      <div
        className={[
          'overflow-hidden transition-[max-height,opacity] duration-300',
          open ? 'max-h-[240px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="border-t border-gray-100">
          <SectionRow label="방문 일" value={dateLabel} onChange={onChangeDate} />
          <div className="h-px bg-gray-100" />
          <SectionRow label="방문 시간" value={timeLabel} onChange={onChangeTime} />
        </div>
      </div>

      <div className="h-px bg-gray-100" />
    </div>
  );
}

export default function EraserConfirmPage() {
  const { state } = useLocation() as { state: LocationState };

  useEffect(() => {
  console.log('✅ confirm state:', state);
  console.log('✅ reservations:', state?.reservations);
}, [state]);

  // state 값들
  const usedPoint = state?.usedPoint ?? 0;
  const items = state?.items ?? [];
  const initialReservations = state?.reservations ?? [];

  // 프로필 store
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const hasAttemptedFetch = useUserStore((s) => s.hasAttemptedFetch);

  useEffect(() => {
    if (!profile && !hasAttemptedFetch) {
      fetchProfile().catch(() => {});
    }
  }, [profile, hasAttemptedFetch, fetchProfile]);

  const nickname = profile?.nickname ?? '회원';

  // 수정 가능하도록 로컬 state
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);

  // 결제 바텀시트
  const [openPaySheet, setOpenPaySheet] = useState(false);

  // UI 맵
  const uiMap = useMemo(() => {
    const m = new Map<number, UiItem>();
    items.forEach((it) => m.set(it.suggestionTaskId, it));
    return m;
  }, [items]);

  // 결제 예정 내역(바텀시트에 넘길 데이터) - Hook은 조기 return 위에서!
  const plannedItems = useMemo(() => {
    return reservations.map((r) => {
      const title = uiMap.get(r.suggestionTaskId)?.title ?? '업무';
      const hours = Math.ceil((r.estimatedMinutes ?? 0) / 60);
      return {
        label: `${title} ${r.count ?? 0}개 (${hours}시간)`,
        price: r.price ?? 0,
      };
    });
  }, [reservations, uiMap]);

  // 기본 펼침: 첫 카드만
  const [openIds, setOpenIds] = useState<Set<number>>(() => {
    const s = new Set<number>();
    if (initialReservations[0]) s.add(initialReservations[0].suggestionTaskId);
    return s;
  });

  const toggleOpen = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 변경용 바텀시트 상태
  const [dateSheet, setDateSheet] = useState<{ open: boolean; targetId: number | null; value: Date | null }>(
    { open: false, targetId: null, value: null }
  );

  const [timeSheet, setTimeSheet] = useState<{ open: boolean; targetId: number | null; value: TimeValue | null }>(
    { open: false, targetId: null, value: null }
  );

  const openDateFor = (id: number) => {
    const target = reservations.find((r) => r.suggestionTaskId === id);
    if (!target) return;
    setDateSheet({ open: true, targetId: id, value: isoToDate(target.visitDate) });
  };

  const openTimeFor = (id: number) => {
    const target = reservations.find((r) => r.suggestionTaskId === id);
    if (!target) return;
    setTimeSheet({ open: true, targetId: id, value: hhmmToTimeValue(target.visitTime) });
  };

  const applyDateChange = (d: Date) => {
    if (!dateSheet.targetId) return;
    const iso = dateToISO(d);
    setReservations((prev) =>
      prev.map((r) => (r.suggestionTaskId === dateSheet.targetId ? { ...r, visitDate: iso } : r))
    );
    setDateSheet({ open: false, targetId: null, value: null });
  };

  const applyTimeChange = (v: TimeValue) => {
    if (!timeSheet.targetId) return;
    const hhmm = timeValueToHHMM(v);
    setReservations((prev) =>
      prev.map((r) => (r.suggestionTaskId === timeSheet.targetId ? { ...r, visitTime: hhmm } : r))
    );
    setTimeSheet({ open: false, targetId: null, value: null });
  };

  // 직접 진입 방지 (Hook 호출 이후에 return 해야 안전)
  if (reservations.length === 0) {
    return (
      <div className="bg-white">
        <Header showBackButton title="예약하기" />
        <div className="px-6 pt-6">
          <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
            예약 정보가 없어요. 이전 단계에서 선택 후 이동해주세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-[110px]">
      <Header showBackButton title="" />

      <div className="px-6 pt-6">
        <p className="text-display-s text-gray-900">{nickname}님</p>
        <p className="mt-1 text-display-s text-gray-900">방문일을 확인해 주세요!</p>
      </div>

      <div className="mt-6 h-3 bg-[#FAFAFA]" />

      <div className="px-6 pt-5">
        <p className="text-body-m-bold text-gray-900">예약 업무</p>
      </div>

      <div className="px-6 mt-3">
        <div className="bg-white">
          {reservations.map((r) => {
            const ui = uiMap.get(r.suggestionTaskId);
            const title = ui?.title ?? `업무 #${r.suggestionTaskId}`;
            const imgUrl = ui?.imgUrl ?? null;
            const open = openIds.has(r.suggestionTaskId);

            return (
              <ReservationCard
                key={r.suggestionTaskId}
                title={title}
                imgUrl={imgUrl}
                visitDate={r.visitDate}
                visitTime={r.visitTime}
                open={open}
                onToggle={() => toggleOpen(r.suggestionTaskId)}
                onChangeDate={() => openDateFor(r.suggestionTaskId)}
                onChangeTime={() => openTimeFor(r.suggestionTaskId)}
              />
            );
          })}
        </div>
      </div>

      <CalendarBottomSheet
        open={dateSheet.open}
        onClose={() => setDateSheet({ open: false, targetId: null, value: null })}
        height="423px"
        monthLabel="26년 2월"
        year={2026}
        month={2}
        value={dateSheet.value}
        onChange={(d) => setDateSheet((prev) => ({ ...prev, value: d }))}
        onConfirm={(d) => applyDateChange(d)}
        ctaLabel="설정하기"
      />

      <TimeWheelBottomSheet
        open={timeSheet.open}
        onClose={() => setTimeSheet({ open: false, targetId: null, value: null })}
        initialValue={timeSheet.value ?? { ampm: '오전', hour: 12, minute: 0 }}
        onConfirm={(v) => applyTimeChange(v)}
        title="방문 시간"
        confirmLabel="설정하기"
      />

      <div
        className="
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-[385px]
          bg-white px-6 pb-6 pt-3
        "
      >
        <button
          type="button"
          className="w-full h-14 rounded-xl bg-[#44BBD0] text-white text-body-l-bold"
          onClick={() => setOpenPaySheet(true)}
        >
          다음
        </button>
      </div>

      <PaySelectBottomSheet
        open={openPaySheet}
        onClose={() => setOpenPaySheet(false)}
        plannedItems={plannedItems}
        discountPoint={usedPoint}
      />
    </div>
  );
}
