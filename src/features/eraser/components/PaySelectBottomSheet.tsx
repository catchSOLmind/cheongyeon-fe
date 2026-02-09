// src/features/eraser/components/PaySelectBottomSheet.tsx
import { useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import IconCoupon from '@/assets/eraser/icon-coupon.svg';

type PayItem = {
  label: string;
  price: number;
};

type Props = {
  open: boolean;
  onClose: () => void;

  // 하드코딩/임시값(원하면 나중에 실제 연결)
  availablePoint?: number; // 사용 가능 포인트
  ownedPoint?: number; // 보유 포인트(없으면 0)

  // 실제 계산에 쓰는 값
  plannedItems?: PayItem[];
  discountPoint?: number; // 할인(포인트 사용) 금액
};

function formatWon(n: number) {
  return `${Number(n || 0).toLocaleString()}원`;
}

function CardIcon({ text }: { text: string }) {
  return (
    <div className="inline-flex h-5 w-9 items-center justify-center rounded-md bg-[#424B4C] px-2 text-[8px] font-semibold text-white">
      {text}
    </div>
  );
}

export default function PaySelectBottomSheet({
  open,
  onClose,
  availablePoint = 10000,
  ownedPoint = 0,
  plannedItems = [],
  discountPoint = 0,
}: Props) {
  // 상세 토글
  const [detailOpen, setDetailOpen] = useState(true);

  // 포인트 입력 UI(일단 하드코딩 영역 유지)
  const [pointInput, setPointInput] = useState(
    String((discountPoint ?? 0).toLocaleString())
  );

  // 계산
  const subtotal = useMemo(() => {
    return plannedItems.reduce((sum, it) => sum + (it.price ?? 0), 0);
  }, [plannedItems]);

  const discount = useMemo(() => {
    const req = Math.max(0, discountPoint ?? 0);
    return Math.min(req, subtotal);
  }, [discountPoint, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const hasItems = plannedItems.length > 0;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      height="calc(100dvh - 15px)"
      showHandle={true}
      showHeaderDivider={false}
      className="rounded-t-3xl"
      contentClassName="px-0 pt-0 pb-0"
    >
      {/* Top bar */}
      <div className="px-5 pt-4">
        <div className="flex items-start justify-between">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="h-8 w-8 -ml-2 flex items-center justify-center rounded-full active:bg-gray-100"
          >
            <span className="text-[25px] leading-none">×</span>
          </button>

          <div className="flex-1" />

          {/* 오른쪽은 비워둠(정렬 맞추기용) */}
          <div className="h-8 w-8" />
        </div>

        <div className="mt-2">
          <p className="text-display-s text-black">할인 및 결제수단을</p>
          <p className="text-display-s text-black">선택해 주세요.</p>
        </div>
      </div>

      {/* 쿠폰 */}
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <p className="text-display-xs text-black">쿠폰</p>
        </div>

       <div className="mt-3 flex items-center gap-2">
        <img src = {IconCoupon} className='w-7 h-10'/>
        <p className="text-body-m text-gray-900">미적용</p>
        <button
            type="button"
            className="ml-auto text-body-m-bold text-primary">
            추가
        </button>
        </div>

        <p className="mt-4 text-body-m text-gray-600">사용 가능한 쿠폰이 없습니다.</p>
      </div>

      <div className="mt-4 h-3 bg-[#FAFAFA]" />

      {/* 보유 포인트 사용 (하드코딩 UI 유지) */}
      <div className="px-5 pt-5">
        <p className="text-display-xs text-black">보유 포인트 사용</p>

        <div className="mt-4 rounded-2xl bg-white">
          <div className="flex items-center gap-2">
            <div className="h-5 w-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-[11px] font-bold text-white">P</span>
            </div>
            <p className="text-body-l-bold text-black">우리집 포인트</p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-gray-300 px-4 py-2 h-[44px]">
              <input
                value={pointInput}
                onChange={(e) => setPointInput(e.target.value)}
                inputMode="numeric"
                className="w-full bg-transparent outline-none text-body-m text-gray-900"
              />
            </div>

            <button
              type="button"
              className="h-[44px] rounded-lg bg-primary px-4 text-body-m-bold text-white"
            >
              사용 안함
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <p className="text-body-m-bold text-primary-800">
                사용 가능 {availablePoint.toLocaleString()}P / 
            </p>
            <p className="text-body-m text-gray-600">
            보유 {ownedPoint.toLocaleString()}P
            </p>
            </div>
        </div>
      </div>

      <div className="mt-5 h-3 bg-[#FAFAFA]" />

      {/* 결제수단 (하드코딩) */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-display-xs text-black">결제수단</p>
          <button type="button" className="text-body-m-bold text-primary">
            등록
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <CardIcon text="Pay"/>
          <p className="text-body-l-bold text-black">결제수단 없음</p>
        </div>

        <p className="mt-4 text-body-m text-semantic-error">결제수단을 등록해주세요.</p>
      </div>

      <div className="mt-5 h-3 bg-[#FAFAFA]" />

      {/* 결제 예정내역 ~ 할인금액 ~ 총 결제금액 */}
      <div className="px-6 pt-5">
        <button
          type="button"
          onClick={() => setDetailOpen((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <p className="text-display-xs text-black">결제 예정내역</p>
          <svg
            className={`h-5 w-5 text-gray-700 transition-transform ${detailOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {detailOpen && (
          <div className="mt-4">
            <p className="text-body-l text-black">가사 청소</p>

            {!hasItems ? (
              <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-body-s text-gray-500">
                결제 예정 항목이 없어요.
              </div>
            ) : (
              <>
                <div className="mt-3 space-y-3">
                  {plannedItems.map((it, idx) => (
                    <div
                      key={`${it.label}-${idx}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <p className="text-body-m text-gray-700 break-keep">{it.label}</p>
                      <p className="text-body-m text-gray-700 flex-shrink-0">
                        {formatWon(it.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-px bg-gray-300" />

                {/* 할인 */}
                <div className="mt-4">
                  <p className="text-body-l text-black">할인 금액</p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-body-m text-gray-700">우리집 포인트</p>
                    <p className="text-body-m text-red-500">-{formatWon(discount)}</p>
                  </div>
                </div>

                <div className="mt-5 h-px bg-gray-200" />

                {/* 총 결제 */}
                <div className="mt-9 mb-9 flex items-end justify-between">
                  <p className="text-body-l text-black">총 결제 금액</p>
                  <p className="text-[20px] font-semibold text-gray-900">{formatWon(total)}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <BottomCTAWrapper showTopBorder sticky>
        <BottomCTAButton label='예약 완료하기'/>
      </BottomCTAWrapper>

      <div className="h-3" />
    </BottomSheet>
  );
}
