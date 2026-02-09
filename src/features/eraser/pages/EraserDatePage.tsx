
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';
import PlaceholderImg from '@/assets/common/img-default-profile.svg';
import IconRight from '@/assets/common/icon-right-lightgray.svg';
import ManagerImg from '@/assets/eraser/img-cheongyeon-profile.png';

import CalendarBottomSheet from '@/shared/components/CalendarBottomSheet';
import TimeWheelBottomSheet from '@/shared/components/TimewheelBottomsheet';
import type { TimeValue } from '@/shared/utils/Timeutils';

type QueueItem = {
  suggestionTaskId: number;
  optionId: number;
  title: string;
  imgUrl: string | null;
  count: number;
  estimatedMinutes: number;
  price: number;
};

type Reservation = {
  suggestionTaskId: number;
  optionId: number;
  title: string;
  imgUrl: string | null;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm (24h)
};

type UiItem = {
  suggestionTaskId: number;
  title: string;
  imgUrl: string | null;
};

type LocationState = {
  queue?: QueueItem[];
  done?: Reservation[];
  usedPoint?: number;
  allItems?: UiItem[];
};

type SelectRowProps = {
  label: string;
  value?: string | null;
  onClick?: () => void;
};

function SelectRow({ label, value, onClick }: SelectRowProps) {
  return (
    <div className="px-6">
      <div className="flex items-center justify-between py-6">
        <div
          className={[
            'text-dlsply-s',
            value ? 'text-gray-900' : 'text-gray-600',
          ].join(' ')}
        >
          {value ?? label}
        </div>
        <button
          type="button"
          onClick={onClick}
          className="h-10 min-w-[64px] rounded-full border border-gray-300 px-4 text-body-l text-black bg-white"
        >
          선택
        </button>
      </div>
      <div className="h-px bg-gray-100" />
    </div>
  );
}

function formatISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function to24h(t: TimeValue) {
  let hour = t.hour % 12;
  if (t.ampm === '오후') hour += 12;
  const hh = String(hour).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${hh}:${mm}`;
}

function formatTimeLabel(t: TimeValue) {
  const hh = String(t.hour).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${t.ampm} ${hh}:${mm}`;
}

// 선택 UI 분리: key로 재마운트되면서 state 자동 초기화됨
function ReservationPicker({
  onSubmit,
}: {
  onSubmit: (payload: { visitDate: string; visitTime: string }) => void;
}) {
  const [openDateSheet, setOpenDateSheet] = useState(false);
  const [openTimeSheet, setOpenTimeSheet] = useState(false);

  const [visitDateValue, setVisitDateValue] = useState<Date | null>(null);
  const [visitTimeValue, setVisitTimeValue] = useState<TimeValue | null>(null);

  const visitDateText = useMemo(() => {
    if (!visitDateValue) return null;
    return formatISODate(visitDateValue);
  }, [visitDateValue]);

  const visitTimeText = useMemo(() => {
    if (!visitTimeValue) return null;
    return formatTimeLabel(visitTimeValue);
  }, [visitTimeValue]);

  const canNext = Boolean(visitDateValue && visitTimeValue);

  return (
    <>
      <div className="mt-6">
        <SelectRow
          label="방문 일"
          value={visitDateText}
          onClick={() => setOpenDateSheet(true)}
        />
        <SelectRow
          label="방문 시간"
          value={visitTimeText}
          onClick={() => setOpenTimeSheet(true)}
        />
      </div>

      <CalendarBottomSheet
        open={openDateSheet}
        onClose={() => setOpenDateSheet(false)}
        height="423px"
        monthLabel="26년 2월"
        year={2026}
        month={2}
        value={visitDateValue}
        onChange={(d) => setVisitDateValue(d)}
        onConfirm={(d) => {
          setVisitDateValue(d);
          setOpenDateSheet(false);
        }}
        ctaLabel="설정하기"
      />

      <TimeWheelBottomSheet
        open={openTimeSheet}
        onClose={() => setOpenTimeSheet(false)}
        initialValue={visitTimeValue ?? { ampm: '오전', hour: 12, minute: 0 }}
        onConfirm={(v) => {
          setVisitTimeValue(v);
          setOpenTimeSheet(false);
        }}
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
          disabled={!canNext}
          onClick={() => {
            if (!visitDateValue || !visitTimeValue) return;
            onSubmit({
              visitDate: formatISODate(visitDateValue),
              visitTime: to24h(visitTimeValue),
            });
          }}
          className={[
            'w-full h-14 rounded-xl text-body-l-bold',
            canNext ? 'bg-[#44BBD0] text-white' : 'bg-gray-200 text-gray-400',
          ].join(' ')}
        >
          다음
        </button>
      </div>
    </>
  );
}

export default function EraserDatePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  const queue = state?.queue ?? [];
  const done = state?.done ?? [];
  const usedPoint = state?.usedPoint ?? 0;

  // ✅ confirm 페이지에서 쓰는 items(UiItem[]) 형태로 끝까지 유지
  const allItems: UiItem[] =
    state?.allItems ??
    [...done, ...queue].map((x) => ({
      suggestionTaskId: x.suggestionTaskId,
      title: x.title,
      imgUrl: x.imgUrl ?? null,
    }));

  const current = queue[0] ?? null;

  const totalCount = done.length + queue.length;
  const currentIndex = done.length + 1;

  if (!current) {
    return (
      <div className="bg-white">
        <Header showBackButton />
        <div className="px-6 pt-6">
          <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
            이전 화면에서 선택 후 이동해주세요.
          </div>
        </div>
      </div>
    );
  }

  const iconSrc = current.imgUrl ? current.imgUrl : PlaceholderImg;

  // ConfirmPage(LocationState: { reservations, items, usedPoint })에 맞춰서 라우팅
  const handleSubmit = ({
    visitDate,
    visitTime,
  }: {
    visitDate: string;
    visitTime: string;
  }) => {
    const newReservation: Reservation = {
      ...current,
      visitDate,
      visitTime,
    };

    const nextDone = [...done, newReservation];
    const nextQueue = queue.slice(1);

    // 1) 다음 업무가 남아있으면 date에서 계속
    if (nextQueue.length > 0) {
      navigate('/eraser/date', {
        replace: true,
        state: {
          queue: nextQueue,
          done: nextDone,
          usedPoint,
          allItems,
        },
      });
      return;
    }

    // 2) 다 선택했으면 confirm으로 이동 (confirm이 기대하는 shape로 전달)
    navigate('/eraser/confirm', {
    replace: true,
    state: {
      usedPoint,
      items: allItems,
      reservations: nextDone,
    },
  });
  };

  return (
    <div className="bg-white pb-[110px]">
      <Header showBackButton title={`예약하기 ${currentIndex}/${totalCount}`} />

      <div className="px-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={iconSrc}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PlaceholderImg;
              }}
            />
          </div>
          <p className="text-body-m-bold text-black">{current.title}</p>
        </div>
      </div>

      <div className="mt-4 h-px bg-gray-300" />

      <div className="px-6 pt-6">
        <p className="text-price-l text-black">날짜/시간을 선택해 주세요.</p>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-body-l text-gray-700">교육받은 매니저님이 방문합니다.</p>
            <button
              type="button"
              className="mt-1 inline-flex items-center gap-1 text-body-m text-gray-600"
              onClick={() => {}}
            >
              어떤 교육을 받나요?
              <img src={IconRight} className="w-5 h-5" />
            </button>
          </div>

          <div className="w-[60px] h-[60px] flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
            <img src={ManagerImg} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* current 바뀌면 여기 컴포넌트가 새로 마운트 → 선택값 자동 초기화 */}
      <ReservationPicker key={current.suggestionTaskId} onSubmit={handleSubmit} />
    </div>
  );
}
