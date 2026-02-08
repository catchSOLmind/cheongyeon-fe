import { useMemo, useState } from 'react';
import Header from '@/shared/components/Header';
import { useNavigate } from 'react-router-dom';

type ReasonCode =
  | 'TIME_LACK'
  | 'OTHER_SCHEDULE'
  | 'SICK'
  | 'NO_TOOLS'
  | 'FORGOT'
  | 'NOT_HOME'
  | 'ETC';

const REASONS: { code: ReasonCode; label: string }[] = [
  { code: 'TIME_LACK', label: '시간이 부족해요' },
  { code: 'OTHER_SCHEDULE', label: '다른 일정이 생겼어요' },
  { code: 'SICK', label: '몸이 안 좋아요' },
  { code: 'NO_TOOLS', label: '청소 도구가 없어요' },
  { code: 'FORGOT', label: '깜빡했어요' },
  { code: 'NOT_HOME', label: '집에 없어요' },
  { code: 'ETC', label: '기타' },
];

type Props = {
  title?: string; // 상단 중앙 타이틀
  taskName?: string; // "설거지 하기"
  fromLabel?: string; // "1월 21일 (수)"
  toLabel?: string; // "1월 30일 (금)"
  onBack?: () => void;

  onCancel?: () => void;
  onConfirm?: (payload: { reason: ReasonCode; customText?: string }) => void;
};

export default function ChoiceReasonPage({
  taskName = '설거지 하기',
  fromLabel = '1월 21일 (수)',
  toLabel = '1월 30일 (금)',
  onCancel,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<ReasonCode>('OTHER_SCHEDULE');
  const [customText, setCustomText] = useState('');

  const navigate = useNavigate();

  const isEtc = selected === 'ETC';
  const maxLen = 200;

  const canSubmit = useMemo(() => {
    if (!selected) return false;
    if (!isEtc) return true;
    return customText.trim().length > 0;
  }, [selected, isEtc, customText]);

  return (
    <div className="min-h-dvh bg-white">
      <Header title='이유 선택하기' showBackButton/>
      {/* Content */}
      <div className="px-5 pt-5 pb-28">
        {/* Task summary row */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100" />
          <div className="flex flex-col">
            <p className="text-body-m-bold text-gray-900">{taskName}</p>
            <p className="text-body-s text-gray-600">
              {fromLabel} <span className="text-gray-400">→</span>{' '}
              <span className="text-primary">{toLabel}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-gray-200" />

        {/* Title */}
        <h2 className="mt-6 text-display-xs text-black">
          일정을 미루는 이유가 <br />
          무엇인가요?
        </h2>

        {/* Chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {REASONS.map((r) => {
            const active = selected === r.code;
            return (
              <button
                key={r.code}
                type="button"
                onClick={() => setSelected(r.code)}
                className={[
                  'px-4 py-2 rounded-full border text-body-m',
                  active ? 'border-primary bg-primary-50 text-gray-800' : 'border-gray-200 bg-white text-gray-800',
                ].join(' ')}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* ETC input */}
        {isEtc && (
          <div className="mt-10">
            <p className="text-body-m-bold text-gray-900">사유를 직접 입력해주세요</p>

            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value.slice(0, maxLen))}
              placeholder="예: 다른 사람이 이미 했어요"
              className="mt-3 w-full h-40 rounded-xl border border-gray-200 px-4 py-3 text-body-m resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <p className="mt-2 text-body-s text-gray-400">
              글자수 제한: {customText.length}/{maxLen}
            </p>
          </div>
        )}
      </div>

      {/* Bottom fixed buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="mx-auto w-full max-w-[420px] px-5 pb-5">
          <div className="h-px w-full bg-gray-100 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-14 rounded-lg bg-gray-200 text-gray-600 text-body-m-bold"
            >
              취소
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                onConfirm?.({ reason: selected, customText: isEtc ? customText.trim() : undefined });
                navigate('/calendar');
                }}
              className={[
                'h-14 rounded-lg text-body-m-bold',
                canSubmit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400',
              ].join(' ')}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
