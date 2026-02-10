import { useEffect, useState } from 'react';
import IconCheckGray from '@/assets/eraser/icon-check-gray.svg';
import IconCheckBlue from '@/assets/eraser/icon-check-blue.svg';
import ImgEraser from '@/assets/eraser/img-magic-eraser.png';
import IconClock from '@/assets/eraser/icon-clock.svg';
import IconClipboard from '@/assets/eraser/icon-clipboard.svg';
import { useNavigate } from 'react-router-dom';


interface EraserAnalyzePopupProps {
  open: boolean;
  onClose: () => void;
}

export default function EraserAnalyzePopup({
  open,
  onClose,
}: EraserAnalyzePopupProps) {
  const [checkedIndex, setCheckedIndex] = useState<number>(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    // ✅ 동기 setState 경고/플리커 방지: rAF로 초기화 + 타이머 시퀀스
    const raf = requestAnimationFrame(() => setCheckedIndex(-1));
    const timer1 = setTimeout(() => setCheckedIndex(0), 1000);
    const timer2 = setTimeout(() => setCheckedIndex(1), 2000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [open]);

  if (!open) return null;

  const showActions = checkedIndex >= 1;

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-[315px] rounded-[20px] bg-white px-6 pt-8 pb-6">
        {/* 상단 이미지 */}
        <div className="flex justify-center mb-5">
          <img
            src={ImgEraser}
            alt="청연 지우개 완료"
            className="w-[92px] h-[92px]"
          />
        </div>

        {/* 타이틀 */}
        <span className="block mt-3 text-center text-display-xs text-black">
          청연 지우개가 일정 분석을 완료했어요
        </span>

        {/* 서브 */}
        <p className="mt-2 text-center text-body-s text-gray-800">
          청연 지우개가 최적의 방법을 찾았어요
        </p>

        {/* 결과 리스트 */}
        <div className="mt-6 flex flex-col gap-3">
          <ResultItem
            label="최적화 제안 생성"
            active={checkedIndex >= 0}
            leftIcon={IconClipboard}
          />
          <ResultItem
            label="시간 절약량 계산"
            active={checkedIndex >= 1}
            leftIcon={IconClock}
          />
        </div>

        {/* 버튼: 2초 후 등장 + fade-in-up */}
        {showActions && (
          <div className="mt-6 flex gap-2 animate-fade-in-up">
            <button
              className="flex-1 h-12 rounded-xl bg-gray-200 text-body-l-bold text-gray-500"
              onClick={onClose}
            >
              취소
            </button>

            <button
              className="flex-1 h-12 rounded-xl bg-primary-500 text-white text-body-l-bold"
              onClick={() => {
                onClose();
                navigate('/eraser/result');
              }}
            >
              확인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultItem({
  leftIcon,
  label,
  active,
}: {
  leftIcon: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* 좌측: 하늘색 원 + 아이콘 */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
            active ? 'bg-primary-50' : 'bg-gray-100'
          }`}
        >
          <img
            src={leftIcon}
            alt=""
            className={`w-4 h-4 transition-opacity duration-300 ${
              active ? 'opacity-100' : 'opacity-60'
            }`}
          />
        </div>
        <span className="text-body-m-bold text-gray-800">{label}</span>
      </div>

      {/* 우측 체크 */}
      <img
        src={active ? IconCheckBlue : IconCheckGray}
        alt="check"
        className="w-5 h-5 transition-all duration-300"
      />
    </div>
  );
}
