import { useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { WheelPicker } from '@/shared/components/WheelPicker'; 
import type { TimeValue } from '@/shared/utils/Timeutils';


type TimeWheelBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  initialValue?: TimeValue;
  onConfirm: (value: TimeValue) => void | Promise<void>;
  pending?: boolean;
  title?: string;
  confirmLabel?: string;
};

export default function TimeWheelBottomSheet({
  open,
  onClose,
  initialValue = { ampm: '오전', hour: 12, minute: 0 },
  onConfirm,
  pending = false,
  confirmLabel = '확인',
}: TimeWheelBottomSheetProps) {
  const [local, setLocal] = useState(initialValue);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  // open이 변경될 때마다 initialValue로 리셋
  const resetKey = open ? JSON.stringify(initialValue) : 'closed';

  return (
    <BottomSheet open={open} onClose={onClose} height="399px">
      <div className="pt-6 pb-4 flex flex-col h-full" key={resetKey}>
        {/* Wheel Container */}
        <div className="flex-1 px-4 flex items-center justify-center gap-2">
          {/* 오전/오후 */}
          <div className="flex-1">
            <WheelPicker
              items={['오전', '오후'] as const}
              value={local.ampm}
              onChange={(v) => setLocal((p) => ({ ...p, ampm: v }))}
              itemHeight={40}
              visibleCount={5}
            />
          </div>

          {/* 시 */}
          <div className="flex-1">
            <WheelPicker
              items={hours}
              value={local.hour}
              onChange={(v) => setLocal((p) => ({ ...p, hour: v }))}
              itemHeight={40}
              visibleCount={5}
              renderItem={(h) => String(h).padStart(2, '00')}
            />
          </div>

          {/* 분 */}
          <div className="flex-1">
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

        {/* CTA */}
        <BottomCTAWrapper>
          <BottomCTAButton
            label={confirmLabel}
            disabled={pending}
            onClick={() => onConfirm(local)}
          />
        </BottomCTAWrapper>
      </div>
    </BottomSheet>
  );
}