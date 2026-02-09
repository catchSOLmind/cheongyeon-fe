import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';
import PlaceholderImg from '@/assets/common/img-default-profile.svg';

type QueueItem = {
  suggestionTaskId: number;
  optionId: number;
  title: string;
  imgUrl: string | null;
};

type Reservation = {
  suggestionTaskId: number;
  optionId: number;
  visitDate: string;
  visitTime: string;
};

type LocationState = {
  queue?: QueueItem[];     // 앞으로 처리할 업무들
  done?: Reservation[];    // 이미 확정된 예약들(누적)
  usedPoint?: number;      // 나중에 최종 제출용
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
        <div className="text-body-m-bold text-gray-300">{label}</div>

        <button
          type="button"
          onClick={onClick}
          className={[
            'h-10 min-w-[64px] rounded-full border px-4 text-body-m',
            value
              ? 'border-gray-300 text-gray-800 bg-white'
              : 'border-gray-200 text-gray-500 bg-white',
          ].join(' ')}
        >
          {value ? value : '선택'}
        </button>
      </div>

      <div className="h-px bg-gray-100" />
    </div>
  );
}

export default function EraserDatePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  const queue = state?.queue ?? [];
  const done = state?.done ?? [];
  const usedPoint = state?.usedPoint ?? 0;

  const current = queue[0];
  const remainCount = Math.max(0, queue.length - 1);

  const titleText = useMemo(() => {
    if (!current) return '청연지우개';
    return remainCount > 0 ? `${current.title} 외 ${remainCount}건` : current.title;
  }, [current, remainCount]);

  const iconSrc = current?.imgUrl ? current.imgUrl : PlaceholderImg;

  const [visitDate, setVisitDate] = useState<string | null>(null);
  const [visitTime, setVisitTime] = useState<string | null>(null);

  const canNext = Boolean(visitDate && visitTime);

  // 직접 진입 방지
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

  const handleNext = () => {
    if (!visitDate || !visitTime) return;

    // 1) 현재 업무를 확정 예약으로 누적
    const newReservation: Reservation = {
      suggestionTaskId: current.suggestionTaskId,
      optionId: current.optionId,
      visitDate,
      visitTime,
    };

    const nextDone = [...done, newReservation];

    // 2) queue에서 현재 업무 제거
    const nextQueue = queue.slice(1);

    // 3) 아직 남아있으면 다시 DatePage로 (다음 업무)
    if (nextQueue.length > 0) {
      navigate('/eraser/date', {
        replace: true, // ✅ 뒤로가기 히스토리 더럽히지 않게
        state: {
          queue: nextQueue,
          done: nextDone,
          usedPoint,
        },
      });

      // 다음 업무 넘어가면 날짜/시간 초기화
      setVisitDate(null);
      setVisitTime(null);
      return;
    }

    // 4) 다 끝났으면 최종 페이지로
    navigate('/eraser/confirm', {
      state: {
        usedPoint,
        reservations: nextDone, // ✅ 최종 제출용 reservations 완성
      },
    });
  };

  return (
    <div className="bg-white pb-[110px]">
      <Header showBackButton />

      {/* 상단 타이틀 */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-gray-100">
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
          <p className="text-body-l-bold text-gray-900">{titleText}</p>
        </div>

        {/* ✅ 진행 표시 (선택) */}
        <p className="mt-2 text-body-s text-gray-500">
          {done.length + 1} / {done.length + queue.length} 건
        </p>
      </div>

      <div className="mt-4 h-px bg-gray-100" />

      {/* 헤드라인 */}
      <div className="px-6 pt-6">
        <p className="text-display-s text-gray-900">날짜/시간을 선택해 주세요.</p>
        <div className="mt-4">
          <p className="text-body-m text-gray-600">교육받은 매니저님이 방문합니다.</p>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-body-m text-gray-700"
            onClick={() => {}}
          >
            어떤 교육을 받나요? <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* 선택 */}
      <div className="mt-6">
        <SelectRow
          label="방문 일"
          value={visitDate}
          onClick={() => setVisitDate((v) => (v ? null : '2026-02-14'))}
        />
        <SelectRow
          label="방문 시간"
          value={visitTime}
          onClick={() => setVisitTime((v) => (v ? null : '14:00'))}
        />
      </div>

      {/* CTA */}
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
          onClick={handleNext}
          className={[
            'w-full h-14 rounded-xl text-body-l-bold',
            canNext ? 'bg-[#44BBD0] text-white' : 'bg-gray-200 text-gray-400',
          ].join(' ')}
        >
          다음
        </button>
      </div>
    </div>
  );
}
