import { useEffect, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import type { IncompleteReasonCode } from '@/features/calendar/types/task.types';

interface ReasonChangeBottomSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    reasonCode: IncompleteReasonCode;
    reasonText?: string;
  }) => void;
}

const REASON_OPTIONS: { label: string; value: IncompleteReasonCode }[] = [
  { label: '일정이 바빠요', value: 'BUSY' },
  { label: '몸이 안 좋았어요', value: 'SICK' },
  { label: '깜빡했어요', value: 'FORGOT' },
  { label: '청소 도구가 없었어요', value: 'NO_TOOL' },
  { label: '기타', value: 'ETC' },
];

const MAX_LEN = 200;

export default function ReasonChangeBottomSheet({
  open,
  onClose,
  onConfirm,
}: ReasonChangeBottomSheetProps) {
  const [selectedReason, setSelectedReason] =
    useState<IncompleteReasonCode>('BUSY');

  // ETC 작성 전용
  const [openEtcSheet, setOpenEtcSheet] = useState(false);
  const [reasonText, setReasonText] = useState('');

  // 열릴 때마다 초기화
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedReason('BUSY');
      setReasonText('');
      setOpenEtcSheet(false);
    }
  }, [open]);

  const handleSelect = (value: IncompleteReasonCode) => {
    setSelectedReason(value);

    if (value === 'ETC') {
      // "기타"를 누르면 작성 바텀시트로 이동
      setOpenEtcSheet(true);
    } else {
      // 다른 사유를 선택하면 작성 바텀시트가 열려있을 수도 있으니 닫기
      setOpenEtcSheet(false);
      setReasonText('');
    }
  };

  const handleConfirmSelectSheet = () => {
    if (selectedReason === 'ETC') {
      // ETC는 여기서 confirm 호출하지 말고 작성 바텀시트로 보내기
      setOpenEtcSheet(true);
      return;
    }

    onConfirm({ reasonCode: selectedReason });
    onClose();
  };

  const handleConfirmEtcSheet = () => {
    const trimmed = reasonText.trim();

    onConfirm({
      reasonCode: 'ETC',
      ...(trimmed ? { reasonText: trimmed } : {}),
    });

    setOpenEtcSheet(false);
    onClose();
  };

  const handleCloseAll = () => {
    setOpenEtcSheet(false);
    onClose();
  };

  return (
    <>
      {/* 1) 사유 선택 바텀시트 */}
      <BottomSheet
        open={open && !openEtcSheet}
        onClose={handleCloseAll}
        title="미완료 사유 선택"
        height="479px"
        showHeaderDivider
      >
        <div className="flex flex-col gap-3">
          {REASON_OPTIONS.map((option) => {
            const isSelected = option.value === selectedReason;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={[
                  'w-full rounded-lg px-4 py-3 text-left text-body-l-bold',
                  'transition-colors',
                  isSelected
                    ? 'bg-[#F1FBFF] border border-primary text-gray-900'
                    : 'bg-white text-gray-900',
                ].join(' ')}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleCloseAll}
            className="flex-1 h-12 rounded-lg bg-gray-200 text-body-m-bold text-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirmSelectSheet}
            className="flex-1 h-12 rounded-lg bg-[#424B4C] text-body-m-bold text-white"
          >
            확인
          </button>
        </div>
      </BottomSheet>

      {/* ETC 작성 바텀시트 */}
      <BottomSheet
        open={open && openEtcSheet}
        onClose={() => setOpenEtcSheet(false)}
        title="미완료 사유를 작성해주세요"
        height="373px"
        showHeaderDivider
      >
        <div className="flex flex-col gap-3">
          <textarea
            value={reasonText}
            onChange={(e) => {
              const v = e.target.value;
              if (v.length <= MAX_LEN) setReasonText(v);
            }}
            placeholder="예: 다른 사람이 이미 했어요"
            className="h-40 w-full resize-none rounded-lg border border-gray-300 p-4 text-body-m focus:outline-none"
          />

          <div className="text-body-s text-gray-700 text-left">
            글자수 제한: {reasonText.length}/{MAX_LEN}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setOpenEtcSheet(false)}
            className="flex-1 h-12 rounded-lg bg-gray-200 text-body-m-bold text-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirmEtcSheet}
            className="flex-1 h-12 rounded-lg bg-[#424B4C] text-body-m-bold text-white disabled:opacity-50"
            disabled={reasonText.trim().length === 0}
          >
            확인
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
