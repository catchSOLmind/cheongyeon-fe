interface BottomCTAWrapperProps {
  children: React.ReactNode;
  sticky?: boolean;
  fixed?: boolean;
  showTopBorder?: boolean;
  className?: string;
  /** 앱쉘 최대 폭 (Tailwind class) */
  maxWidthClass?: string; // default: 'max-w-[385px]'
}

export function BottomCTAWrapper({
  children,
  sticky = false,
  fixed = false,
  showTopBorder = false,
  className = '',
  maxWidthClass = 'max-w-[385px]',
}: BottomCTAWrapperProps) {
  const positionClass = fixed ? 'fixed' : sticky ? 'sticky' : 'relative';
  const borderClass = showTopBorder ? 'border-t border-gray-200' : '';

  const fixedWidthClass = fixed
    ? `left-1/2 -translate-x-1/2 w-full ${maxWidthClass}`
    : 'left-0 right-0';

  return (
    <div
      className={[
        positionClass,
        'bottom-0',
        fixedWidthClass,
        'px-5 py-4 bg-white z-50',
        borderClass,
        // fixed일 때 wrapper는 클릭 통과
        fixed ? 'pointer-events-none' : '',
        className,
      ].join(' ')}
    >
      {/* 버튼/컨텐츠만 클릭 가능 */}
      <div className={fixed ? 'pointer-events-auto' : ''}>
        {children}
      </div>
    </div>
  );
}


// 사용 예시 - 옵션을 뒤에 붙이면 됨
//   <BottomCTAWrapper sticky>
//   <BottomCTAButton ... />
//   </BottomCTAWrapper>