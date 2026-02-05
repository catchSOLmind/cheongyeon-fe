interface BottomCTAWrapperProps {
    children: React.ReactNode;
    sticky?: boolean;
    fixed?: boolean;
    showTopBorder?: boolean;
    className?: string;
  }
  
  export function BottomCTAWrapper({
    children,
    sticky = false,
    fixed = false,
    showTopBorder = false,
    className = '',
  }: BottomCTAWrapperProps) {
    const positionClass = fixed ? 'fixed' : sticky ? 'sticky' : 'relative';
    const borderClass = showTopBorder ? 'border-t border-gray-200' : '';
  
    return (
      <div className={`${positionClass} bottom-0 left-0 right-0 px-5 py-4 bg-white z-50 ${borderClass} ${className}`}>
        {children}
      </div>
    );
  }

// 사용 예시 - 옵션을 뒤에 붙이면 됨
//   <BottomCTAWrapper sticky>
//   <BottomCTAButton ... />
//   </BottomCTAWrapper>