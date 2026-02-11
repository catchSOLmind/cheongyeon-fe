import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '@/shared/components/Header';
import Steppers from '../components/Steppers';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import CalendarBottomSheet from '@/shared/components/CalendarBottomSheet';

import { useUserStore } from '@/features/auth/stores/useUserStore';
import ImageDefault from '@/assets/common/img-default-profile.svg';

import { useGroupInvite } from '../hooks/useGroupInvite';
import { createAgreement } from '@/features/agreement/api/agreementApi';
import type { CreateAgreementRequest } from '../types/ageement.types';

type LocationState = {
  houseName?: string;
  monthlyGoal?: string;
  rules?: string[];
};

const formatYMD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function AgreementPage02() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  // Page01에서 넘어온 초안 값
  const houseName = state?.houseName ?? '';
  const monthlyGoal = state?.monthlyGoal ?? '';
  const rules = state?.rules ?? [];

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const avatarUrl = useUserStore((s) => s.profile?.profileImageUrl);

  const { createAndShare, isLoading } = useGroupInvite();

  const handleInvite = async () => {
  try {
    await createAndShare();
  } catch {
    // 필요하면 토스트 처리
  }
};
  const canSubmit = useMemo(() => {
    return (
      houseName.trim().length > 0 &&
      monthlyGoal.trim().length > 0 &&
      rules.length >= 1 &&
      !!deadline &&
      !submitting
    );
  }, [houseName, monthlyGoal, rules.length, deadline, submitting]);

  const handleSubmit = async () => {
    if (!canSubmit || !deadline) return;

    const payload: CreateAgreementRequest = {
      deadline: formatYMD(deadline), // 캘린더에서 선택한 마감일
      houseName: houseName.trim(),
      monthlyGoal: monthlyGoal.trim(),
      rules,
    };

    try {
      setSubmitting(true);

      const res = await createAgreement(payload);

      if (!res.isSuccess) {
        // console.warn(res.code, res.message);
        return;
      }

      const agreementId = res.result.agreementId;

      navigate('/agreement/3', { state: { agreementId } });
    } catch {
      console.error('다시시도');
    } finally {
      setSubmitting(false);
    }
  };

  // Page01 state 없이 들어오면 튕기기(원하면 유지/수정 가능)
  if (!houseName || !monthlyGoal || rules.length === 0) {
    // replace로 되돌리기
    navigate('/agreement/1', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="협약서 멤버 초대하기" showBackButton />

      <div className="mx-auto w-full max-w-[390px] px-5 pb-28">
        {/* Stepper */}
        <div className="pt-3">
          <Steppers step={2} />
        </div>

        {/* Title */}
        <div className="mt-3">
          <h1 className="text-display-m text-black whitespace-pre-line">
            멤버를 초대하고{'\n'}협약서를 작성해보세요
          </h1>
          <p className="mt-2 text-body-m text-gray-700">
            멤버와 협약서 확인과 동의가 가능해요
          </p>
        </div>

        {/* Invite area */}
        <div className="mt-12">
          <div className="flex items-start gap-3">
            {/* Invite (plus) */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleInvite}
                disabled={isLoading}
                className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
              <div className="text-body-m text-gray-900">초대(1/5)</div>
            </div>

            {/* Me avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="내 프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={ImageDefault} alt="기본 프로필" />
                )}
              </div>
              <span className="text-primary text-body-m-bold">나</span>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-12">
          <h2 className="text-base font-semibold text-gray-900">협약서 작성 마감일</h2>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(true)}
              className="w-full rounded-[12px] border border-gray-300 bg-[#FAFAFA] px-4 py-4 flex items-center justify-between"
            >
              <span
                className={`text-body-m-bold ${
                  deadline ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {deadline
                  ? `${deadline.getFullYear()}.${deadline.getMonth() + 1}.${deadline.getDate()}`
                  : '날짜 선택'}
              </span>
            </button>
            <p className="mt-[10px] text-body-s text-gray-600">
              마감일 이후에는 협약서를 다시 작성해야 해요.
            </p>
          </div>

          <CalendarBottomSheet
            open={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            year={2026}
            month={2}
            monthLabel="26년 2월"
            value={deadline}
            onChange={(date) => setDeadline(date)}
            onConfirm={(date) => {
              setDeadline(date);
              setIsCalendarOpen(false);
            }}
          />
        </div>

        {/* Bottom button */}
        <BottomCTAWrapper fixed>
          <BottomCTAButton
            label={submitting ? '작성 중...' : '초안 작성 완료'}
            disabled={!canSubmit}
            onClick={handleSubmit}
          />
        </BottomCTAWrapper>
      </div>
    </div>
  );
}
