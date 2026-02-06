interface BottomCTAWrapperProps {
  children: React.ReactNode;
  sticky?: boolean;
  fixed?: boolean;
  showTopBorder?: boolean;
  className?: string;
  /** 앱쉘 최대 폭 (Tailwind class) */
  maxWidthClass?: string; // default: 'max-w-[375px]'
}

export function BottomCTAWrapper({
  children,
  sticky = false,
  fixed = false,
  showTopBorder = false,
  className = '',
  maxWidthClass = 'max-w-[375px]',
}: BottomCTAWrapperProps) {
  const positionClass = fixed ? 'fixed' : sticky ? 'sticky' : 'relative';
  const borderClass = showTopBorder ? 'border-t border-gray-200' : '';

  // fixed일 때만 "앱쉘 폭"으로 제한 + 가운데 정렬
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
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

// 사용 예시 - 옵션을 뒤에 붙이면 됨
//   <BottomCTAWrapper sticky>
//   <BottomCTAButton ... />
//   </BottomCTAWrapper>