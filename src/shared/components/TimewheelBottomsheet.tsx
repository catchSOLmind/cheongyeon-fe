import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import type { TimeValue } from '@/shared/utils/Timeutils';

// ---------- WheelPicker ----------
type WheelPickerProps<T> = {
  items: T[];
  value: T;
  onChange: (v: T) => void;
  itemHeight?: number;
  visibleCount?: number;
  renderItem?: (v: T) => React.ReactNode;
};

function WheelPicker<T>({
  items,
  value,
  onChange,
  itemHeight = 40,
  visibleCount = 5,
  renderItem,
}: WheelPickerProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const half = Math.floor(visibleCount / 2);
  const containerHeight = itemHeight * visibleCount;

  const valueIndex = useMemo(() => {
    const idx = items.findIndex((x) => x === value);
    return Math.max(0, idx);
  }, [items, value]);

  const [activeIndex, setActiveIndex] = useState(valueIndex);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // value가 외부에서 변경되면 스크롤 위치 동기화
  useEffect(() => {
    const el = ref.current;
    if (!el || isScrollingRef.current) return;
    
    el.scrollTo({ top: valueIndex * itemHeight, behavior: 'auto' });
    
    // 다음 프레임에서 activeIndex 업데이트
    requestAnimationFrame(() => {
      setActiveIndex(valueIndex);
    });
  }, [valueIndex, itemHeight]);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      isScrollingRef.current = true;
      
      const currentIndex = Math.round(el.scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, currentIndex));
      
      setActiveIndex(clampedIndex);

      // 기존 타이머 클리어
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // 스크롤이 멈추면 정확한 위치로 스냅
      scrollTimeoutRef.current = window.setTimeout(() => {
        const finalIndex = Math.round(el.scrollTop / itemHeight);
        const finalClamped = Math.max(0, Math.min(items.length - 1, finalIndex));
        
        el.scrollTo({ top: finalClamped * itemHeight, behavior: 'smooth' });
        setActiveIndex(finalClamped);
        onChange(items[finalClamped]);
        
        // 스냅 애니메이션 완료 후 플래그 해제
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      }, 100);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [items, itemHeight, onChange]);

  const spacer = half * itemHeight;

  return (
    <div className="relative" style={{ height: containerHeight }}>
      <div
        ref={ref}
        className="overflow-y-scroll h-full scrollbar-hide"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ height: spacer }} />
        {items.map((it, idx) => {
          const dist = Math.abs(idx - activeIndex);
          const textClass =
            dist === 0
              ? 'text-gray-900'
              : dist === 1
                ? 'text-gray-500'
                : 'text-gray-300';
          return (
            <div
              key={idx}
              style={{ height: itemHeight, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center cursor-pointer ${textClass}`}
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

// ---------- TimeWheelBottomSheet ----------
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
  title = '시간 선택',
  confirmLabel = '확인',
}: TimeWheelBottomSheetProps) {
  const [local, setLocal] = useState(initialValue);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => [0, 10, 20, 30, 40, 50], []);

  // open이 변경될 때마다 initialValue로 리셋
  const resetKey = open ? JSON.stringify(initialValue) : 'closed';

  return (
    <BottomSheet open={open} onClose={onClose} height="399px">
      <div className="pt-6 px-4 pb-4 flex flex-col h-full" key={resetKey}>
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={onClose} className="text-gray-700 mr-3">
            ←
          </button>
          <h2 className="text-title-l-bold">{title}</h2>
        </div>

        {/* Wheel Container */}
        <div className="flex-1 flex items-center justify-center gap-2">
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
              renderItem={(h) => String(h).padStart(2, '0')}
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