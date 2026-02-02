// components/common/BottomCTAButton.tsx
interface BottomCTAButtonProps {
    label: string;
    disabled?: boolean;
    onClick?: () => void;
  }
  
  export function BottomCTAButton({
    label,
    disabled = false,
    onClick,
  }: BottomCTAButtonProps) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-disabled={disabled}
        onClick={disabled ? undefined : onClick}
        className={`
          w-full h-[56px] rounded-lg
          flex items-center justify-center
          text-body-l-bold
          transition-colors
          ${
            disabled
              ? 'bg-gray-100 text-gray-500'
              : 'bg-primary text-white hover:bg-primary-dark'
          }
        `}
      >
        {label}
      </button>
    );
  }
  