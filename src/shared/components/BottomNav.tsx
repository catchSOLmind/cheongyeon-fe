import { useNavigate, useLocation } from 'react-router-dom';

import IconHome from '@/assets/navi/icon-home.svg';
import IconHomeFill from '@/assets/navi/icon-fill-home.svg';

import IconPerson from '@/assets/navi/icon-person.svg';
import IconPersonFill from '@/assets/navi/icon-fill-person.svg';

import IconCalendar from '@/assets/navi/icon-calendar.svg'; 
import IconCalendarFill from '@/assets/navi/icon-fill-calendar.svg';

import IconShop from '@/assets/navi/icon-shop.svg';
import IconShopFill from '@/assets/navi/icon-fill-shop.svg';

import IconEtc from '@/assets/navi/icon-etc.svg';
import IconEtcFill from '@/assets/navi/icon-fill-etc.svg';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/home01',
    label: '홈',
    icon: IconHome,
    activeIcon: IconHomeFill,
  },
  {
    path: '/home02',
    label: '내 예약',
    icon: IconPerson,
    activeIcon: IconPersonFill,
  },
  {
    path: '/calendar',
    label: '우리 집',
    icon: IconCalendar,
    activeIcon: IconCalendarFill,
  },
  {
    path: '/home03',
    label: '플러스샵',
    icon: IconShop,
    activeIcon: IconShopFill,
  },
  {
    path: '/home04',
    label: '더보기',
    icon: IconEtc,
    activeIcon: IconEtcFill,
  },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-[385px] bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item, index) => { 
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={`${item.path}-${index}`}
              onClick={() => handleNavClick(item.path)}
              className={`
                flex flex-col items-center justify-center
                flex-1 h-full gap-1
                transition-colors
              `}
            >
              <img 
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
                className="w-6 h-6"
              />
              <span className={`text-body-s ${isActive ? 'text-gray-800' : 'text-gray-800'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;