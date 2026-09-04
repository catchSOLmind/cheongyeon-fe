//
// [Usage]
// <WheelPicker
//   items={['오전', '오후']}
//   value={ampm}
//   onChange={setAmpm}
// />
//
// <WheelPicker
//   items={hours}
//   value={hour}
//   onChange={setHour}
//   renderItem={(h) => String(h).padStart(2, '0')}
// />

import { useEffect, useMemo, useRef, useState } from 'react';

export type WheelPickerProps<T extends string | number> = {
  /** 선택 가능한 아이템 목록 */
  items: readonly T[];
  /** 현재 선택된 값 */
  value: T;
  /** 값 변경 콜백 */
  onChange: (value: T) => void;
  /** 각 아이템의 높이*/
  itemHeight?: number;
  /** 한 번에 보이는 아이템 개수 */
  visibleCount?: number;
  /** 아이템 렌더링 커스터마이징. 미지정 시 String(value) 사용 */
  renderItem?: (value: T) => React.ReactNode;
  /** 추가 className */
  className?: string;
};

export function WheelPicker<T extends string | number>({
  items,
  value,
  onChange,
  itemHeight = 40,
  visibleCount = 5,
  renderItem,
  className = '',
}: WheelPickerProps<T>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const half = Math.floor(visibleCount / 2);
  const containerHeight = itemHeight * visibleCount;
  const spacer = half * itemHeight;

  // 현재 value의 index
  const valueIndex = useMemo(() => {
    const idx = items.findIndex((x) => x === value);
    return Math.max(0, idx);
  }, [items, value]);

  const [activeIndex, setActiveIndex] = useState<number>(valueIndex);

  // 프로그래매틱 스크롤과 유저 스크롤을 구분하기 위한 ref
  const isProgrammaticRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // 외부 value가 바뀌면 스크롤 위치 동기화
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    isProgrammaticRef.current = true;
    el.scrollTo({ top: valueIndex * itemHeight, behavior: 'auto' });

    // 두 프레임 뒤에 플래그 해제 (스크롤 이벤트가 fire된 후)
    requestAnimationFrame(() => {
      setActiveIndex(valueIndex);
      requestAnimationFrame(() => {
        isProgrammaticRef.current = false;
      });
    });
  }, [valueIndex, itemHeight]);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      // 프로그래매틱 스크롤은 무시
      if (isProgrammaticRef.current) return;

      const currentIndex = Math.round(el.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(items.length - 1, currentIndex));
      setActiveIndex(clamped);

      // 기존 스냅 타이머 클리어
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // 스크롤이 멈추면 정확한 위치로 스냅 후 onChange 호출
      scrollTimeoutRef.current = window.setTimeout(() => {
        const finalIndex = Math.round(el.scrollTop / itemHeight);
        const finalClamped = Math.max(0, Math.min(items.length - 1, finalIndex));

        isProgrammaticRef.current = true;
        el.scrollTo({ top: finalClamped * itemHeight, behavior: 'smooth' });
        setActiveIndex(finalClamped);
        onChange(items[finalClamped]);

        // 스냅 애니메이션 완료 후 플래그 해제
        window.setTimeout(() => {
          isProgrammaticRef.current = false;
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

  // 키보드 접근성: 위/아래 화살표로 선택
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(items.length - 1, activeIndex + 1);
      onChange(items[next]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, activeIndex - 1);
      onChange(items[prev]);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ height: containerHeight }}
      // 키보드 접근성
      role="listbox"
      tabIndex={0}
      aria-label="wheel picker"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={ref}
        className="overflow-y-scroll h-full scrollbar-hide"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* 상단 여백: 첫 아이템이 가운데 오도록 */}
        <div style={{ height: spacer }} aria-hidden="true" />

        {items.map((item, idx) => {
          const dist = Math.abs(idx - activeIndex);
          const isSelected = dist === 0;

          const textClass =
            dist === 0
              ? 'text-gray-900 text-[20px] font-semibold'
              : dist === 1
                ? 'text-gray-500 text-[16px] font-semibold'
                : 'text-gray-300 text-[14px] font-semibold';

          return (
            <div
              key={`${String(item)}-${idx}`}
              role="option"
              aria-selected={isSelected}
              aria-label={String(item)}
              tabIndex={-1}
              style={{ height: itemHeight, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center cursor-pointer transition-all duration-150 ${textClass}`}
              onClick={() => onChange(item)}
            >
              {renderItem ? renderItem(item) : String(item)}
            </div>
          );
        })}

        {/* 하단 여백: 마지막 아이템이 가운데 오도록 */}
        <div style={{ height: spacer }} aria-hidden="true" />
      </div>
    </div>
  );
}