interface BottomCTAWrapperProps {
    children: React.ReactNode;
  }
  
  export function BottomCTAWrapper({ children }: BottomCTAWrapperProps) {
    return (
      <div className="bottom-0 left-0 right-0 px-5 py-4 bg-white">
        {children}
      </div>
    );
  }
  