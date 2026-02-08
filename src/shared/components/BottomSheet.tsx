// src/components/common/BottomSheet.tsx

/*
[Usage]
<BottomSheet
  open={open}
  onClose={onClose}
  title="설거지 하기"
  height="280px"  
>
  {children}
</BottomSheet>
*/

import React from 'react';

interface BottomSheetProps {
  /** 바텀시트 열림 여부 */
  open: boolean;
  /** 바텀시트 닫기 콜백 */
  onClose: () => void;

  /** 상단 제목 */
  title?: string;

  /** 바텀시트 높이 (부모에서 직접 제어) */
  height?: string; 
  /** 바텀시트 내부 콘텐츠 */
  children: React.ReactNode;

  /** 바텀시트 컨테이너 추가 클래스 */
  className?: string;
  /** 바텀시트 내부 요소들 추가 클래스 */
  contentClassName?: string;

  /** 외부를 클릭하면 창 닫기 DEFAULT = TRUE */
  closeOnBackdrop?: boolean;
  /** ESC를 클릭하면 창 닫기 DEFAULT = TRUE */
  closeOnEsc?: boolean;

  /** 상단 드래그 핸들 표시 여부 */
  showHandle?: boolean;
  /** 헤더(제목) 아래 구분선 표시 여부 */
  showHeaderDivider?: boolean;
}

export default function BottomSheet({
  open,
  onClose,
  title,
  height = 'auto',
  children,
  className = '',
  contentClassName = '',
  closeOnBackdrop = true,
  closeOnEsc = true,
  showHandle = true,
  showHeaderDivider = true,
}: BottomSheetProps) {

  //닫힘 애니메이션을 위해 mount 상태 분리
  const [isMounted, setIsMounted] = React.useState(open);

  // open 되면 먼저 마운트
  React.useEffect(() => {
    if (open) setIsMounted(true);
  }, [open]);

  React.useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEsc, onClose]);

  // slide-down 애니메이션 후 unmount
  const handleTransitionEnd = () => {
    if (!open) setIsMounted(false);
  };

  //바로 null 처리하지 않음
  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close bottom sheet"
        className={[
          'absolute inset-0 bg-black/20 z-[0]',
          // backdrop fade 애니메이션
          'transition-opacity duration-250 ease-out',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        style={{ height }}
        // slide 애니메이션 종료 감지
        onTransitionEnd={handleTransitionEnd}
        className={[
          'absolute bottom-0 left-1/2 w-full w-full md:max-w-[385px] -translate-x-1/2',
          'rounded-t-2xl bg-white',
          'shadow-[0_-10px_30px_rgba(0,0,0,0.12)]',
          'overflow-hidden',
          // slide-up / slide-down 애니메이션
          'transition-transform duration-250 ease-out will-change-transform',
          open ? 'translate-y-0' : 'translate-y-full','z-[1]',
          className,
        ].join(' ')}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-2">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>
        )}

        {/* Header */}
        {(title || showHeaderDivider) && (
          <div className="px-5 pt-3">
            {title && (
              <div className="text-center text-body-l-bold text-gray-800">
                {title}
              </div>
            )}
            {showHeaderDivider && <div className="mt-3 h-px w-full bg-gray-200" />}
          </div>
        )}

        {/* Content */}
        <div
          className={[
            'px-4 pb-6 pt-3 overflow-y-auto',
            contentClassName,
          ].join(' ')}
        >
          {children}
        </div>

        {/* iOS 홈 인디케이터 여백 */}
        <div className="h-3" />
      </div>
    </div>
  );
}
