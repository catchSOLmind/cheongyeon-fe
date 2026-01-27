import { useState, useRef, useEffect, type RefObject } from 'react';

type TabType = 'my' | 'all';

interface UseSlideIndicatorReturn {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  indicatorStyle: { left: number; width: number };
  myTabRef: RefObject<HTMLButtonElement | null>;
  allTabRef: RefObject<HTMLButtonElement | null>;
  handleTabClick: (tab: TabType) => void;
}

function useSlideIndicator(initialTab: TabType = 'my'): UseSlideIndicatorReturn {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const myTabRef = useRef<HTMLButtonElement>(null);
  const allTabRef = useRef<HTMLButtonElement>(null);

  const updateIndicatorPosition = (tab: TabType) => {
    const activeEl = tab === 'my' ? myTabRef.current : allTabRef.current;
    if (!activeEl) return;

    const container = activeEl.parentElement;
    if (!container) return;

    const containerLeft = container.getBoundingClientRect().left;
    const tabLeft = activeEl.getBoundingClientRect().left;

    setIndicatorStyle({
      left: tabLeft - containerLeft,
      width: activeEl.offsetWidth,
    });
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setTimeout(() => updateIndicatorPosition(tab), 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => updateIndicatorPosition(activeTab), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activeTab,
    setActiveTab,
    indicatorStyle,
    myTabRef,
    allTabRef,
    handleTabClick,
  };
}

export default useSlideIndicator;