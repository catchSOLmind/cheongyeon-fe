import type { ReactNode } from 'react';

interface DropdownSelectProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedValue: string | number | null;
  placeholder: string;
  displayValue?: string;
  showProfile?: boolean;
  showTag?: string;
  selectedImage?: string;
  children: ReactNode;
}

function DropdownSelect({
  isOpen,
  onToggle,
  selectedValue,
  placeholder,
  displayValue,
  showProfile = false,
  showTag,
  selectedImage,
  children,
}: DropdownSelectProps) {
  const hasSelected = selectedValue !== null && selectedValue !== undefined;

  return (
    <div className="relative">
      <button onClick={onToggle} className="w-full" type="button">
        <div className="w-full h-14 flex items-center gap-3 px-4 rounded-lg border border-gray-300 bg-white">
          {hasSelected ? (
            <>
              {showProfile && (
                <div className="w-8 h-8 rounded-full border border-blue-200 overflow-hidden shrink-0">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="selected"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                  )}
                </div>
              )}
              <span className="text-body-m text-gray-800">
                {displayValue ?? ''}
              </span>

              {showTag && (
                <span className="px-2 py-1 bg-primary-50 text-primary-400 text-label-m rounded-lg shrink-0">
                  {showTag}
                </span>
              )}
            </>
          ) : (
            <span className="text-body-m text-gray-400">{placeholder}</span>
          )}

          <div className="ml-auto">
            <svg
              className={`w-5 h-5 text-gray-800 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export default DropdownSelect;
