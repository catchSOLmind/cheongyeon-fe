import IconCoin from '@/assets/todo/icon-coin.svg';
import ManagerDefaultIcon from '@/assets/todo/category/img-category-manager.svg';

import type { ManagerCallItem } from '../types/groupTask.types';

interface ManagerCallCardProps {
  item: ManagerCallItem;
}

function ManagerCallCard({ item }: ManagerCallCardProps) {
  const formatTime = (time: string) => {
    const parts = time.split(' ');
    return parts.length > 1 ? parts[1] : time;
  };

  return (
    <div className="w-full rounded-xl bg-white p-4">
      <div className="flex items-center gap-3">

        {/* 매니저 기본 아이콘 */}
        <div className="w-8 h-8 rounded-lg bg-[#FAE0F8] flex items-center justify-center">
          <img
            src={ManagerDefaultIcon}
            alt="매니저"
            className="w-8 h-8"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <div className="text-body-m-bold text-black">
            {item.serviceName}
          </div>

          <div className="mt-1 flex items-center gap-2 text-body-m text-gray-700">
            {!!item.visitTime && (
              <>
                <span>{formatTime(item.visitTime)}</span>

                <span className="text-gray-300" aria-hidden>
                  |
                </span>
              </>
            )}

            <div className="flex items-center gap-1">
              <img src={IconCoin} alt="포인트" className="w-4 h-4" />
              <span className="text-body-s text-black">
                {item.point}포인트
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ManagerCallCard;
