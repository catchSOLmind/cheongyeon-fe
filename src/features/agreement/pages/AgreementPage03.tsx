// src/features/agreement/pages/AgreementPage03.tsx
import { useEffect, useMemo, useState } from 'react';

import Header from '@/shared/components/Header';
import Steppers from '@/features/agreement/components/Steppers';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';

import AgreementFeedbackBottomSheet from '../components/AgreementFeedbackBottomSheet';
import ImgFeedback from '@/assets/agreement/icon-feedback-chat.svg';

import { getAgreement } from '@/features/agreement/api/agreementApi';
import { confirmAgreement } from '@/features/agreement/api/agreementApi';
import type { AgreementDetail } from '@/features/agreement/types/agreementDetail.types';

import { useNavigate } from 'react-router-dom';


const getSignLabel = (status?: string) => {
  if (status === 'AGREED') return '동의완료';
  if (status === 'PENDING') return '대기중';
  return '대기중';
};
const isAgreed = (status?: string) => status === 'AGREED';

type ConfirmModalProps = {
  open: boolean;
  confirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function ConfirmAgreementModal({
  open,
  confirming = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* dim */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="닫기"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-full max-w-[320px] rounded-[20px] bg-white px-6 py-6 shadow-xl">
          <h2 className="text-center text-display-xs text-black">
              협약서를 확정할까요?
          </h2>

          <p className="mt-3 text-center text-body-s text-gray-700">
            작성이 끝나면 규칙과 구성원을 수정할 수 없어요
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={confirming}
              className="h-12 rounded-lg border border-gray-300 bg-white text-body-l-bold text-black active:bg-gray-50 disabled:opacity-60"
            >
              취소
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={confirming}
              className="h-12 rounded-lg bg-primary ttext-body-l-bold text-white active:opacity-90 disabled:opacity-60"
            >
              {confirming ? '확정 중...' : '확정'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgreementPage03() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [agreement, setAgreement] = useState<AgreementDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // 팝업
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  /* =======================
   * 협약서 조회 (페이지 진입/새로고침 시 1회)
   * ======================= */
  useEffect(() => {
    let alive = true;

    const fetchAgreement = async () => {
      try {
        setLoading(true);
        const res = await getAgreement();

        if (!alive) return;
        if (!res.isSuccess) return;

        setAgreement(res.result);
      } catch (e) {
        console.error('협약서 조회 실패', e);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchAgreement();
    return () => {
      alive = false;
    };
  }, []);

  /* =======================
   * 파생 데이터
   * ======================= */
  const agreementDateLabel = useMemo(() => {
    if (!agreement?.deadline) return '';

    const d = new Date(agreement.deadline);
    if (Number.isNaN(d.getTime())) {
      const [y, m, dd] = agreement.deadline.split('-');
      return `${y.slice(2)}년 ${Number(m)}월 ${Number(dd)}일`;
    }

    const yy = String(d.getFullYear()).slice(2);
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    return `${yy}년 ${mm}월 ${dd}일`;
  }, [agreement?.deadline]);

  // agreement.members에 OWNER가 있고 + 전원 동의인지
  const hasOwner = useMemo(() => {
    return agreement?.members?.some((m) => m.role === 'OWNER') ?? false;
  }, [agreement?.members]);

  const allAgreed = useMemo(() => {
    return agreement?.members?.every((m) => isAgreed(m.signStatus)) ?? false;
  }, [agreement?.members]);

  // 작성완료 버튼 눌렀을 때 팝업을 띄울 수 있는지
  const canOpenConfirm = useMemo(() => {
    return Boolean(agreement && hasOwner && allAgreed && !loading && !confirming);
  }, [agreement, hasOwner, allAgreed, loading, confirming]);

  /* =======================
   * CTA -> 팝업 오픈
   * ======================= */
  const handleClickWriteDone = () => {
    if (!canOpenConfirm) return;
    setConfirmOpen(true);
  };

  /* =======================
   * 팝업 "확정" -> 서버 확정 API
   * ======================= */
  const handleConfirmAgreement = async () => {
  if (!agreement || confirming) return;

    try {
      setConfirming(true);

      const res = await confirmAgreement(agreement.agreementId);

      if (!res.isSuccess) {
        console.error(res.code, res.message);
        return;
      }

      // 확정 성공
      setConfirmOpen(false);

      // 완료 페이지로 이동
      navigate('/agreement/result', {
        replace: true,
        state: {
          agreementId: agreement.agreementId,
          confirmedAt: res.result.confirmedAt,
        },
      });
    } catch (e) {
      console.error('협약서 확정 실패', e);
    } finally {
      setConfirming(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <Header title="우리집 협약서" showBackButton />

      <div className="mx-auto w-full max-w-[390px] px-5 pb-36">
        {/* Stepper */}
        <div className="pt-3">
          <Steppers step={3} />
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-display-m text-black">협약서를 최종 확인해주세요</h1>
          <p className="mt-2 text-body-m text-gray-700">
            필요한 경우 멤버들이 피드백을 남겨요
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-[14px] text-gray-500">
            협약서를 불러오는 중이에요…
          </div>
        )}

        {/* Content */}
        {!loading && agreement && (
          <div className="mt-6 space-y-5">
            {/* 우리집 이름 */}
            <section>
              <label className="text-body-l text-black">우리집 이름</label>
              <div className="mt-5 w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px]">
                {agreement.houseName}
              </div>
            </section>

            {/* 한 달 목표 */}
            <section>
              <label className="text-body-l text-black">우리집 한 달 목표</label>
              <div className="mt-5 w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px]">
                {agreement.monthlyGoal}
              </div>
            </section>

            {/* 우리집 규칙 */}
            <section>
              <div className="flex items-center justify-between">
                <label className="text-body-l text-black">우리집 규칙</label>
                <span className="text-[12px] leading-[16px] text-gray-700">
                  필수 1개, 최대 5개
                </span>
              </div>

              <div className="space-y-[14px]">
                {(agreement.rules ?? []).map((r) => (
                  <div
                    key={r.itemId}
                    className="mt-5 w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px]"
                  >
                    {r.itemText}
                  </div>
                ))}
              </div>
            </section>

            {/* 멤버 동의 */}
            <section>
              <label className="text-[12px] font-medium text-gray-700">우리집 멤버 동의</label>

              <div className="mt-3 rounded-lg border border-gray-200 bg-white overflow-hidden">
                {agreement.members.map((m, idx) => {
                  const agreed = isAgreed(m.signStatus);
                  const isOwnerRole = m.role === 'OWNER';

                  return (
                    <div
                      key={m.memberId}
                      className={[
                        'flex items-center justify-between px-4 py-3',
                        idx !== 0 ? 'border-t border-gray-100' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {m.profileImageUrl ? (
                            <img
                              src={m.profileImageUrl}
                              alt={m.nickname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[12px] text-gray-500">🙂</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[14px] text-gray-900">{m.nickname}</span>
                          {isOwnerRole && (
                            <span className="px-2 h-6 rounded-full bg-gray-100 text-[12px] text-gray-500 flex items-center">
                              대표자
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={[
                          'px-3 h-7 rounded-full text-[12px] flex items-center justify-center',
                          agreed ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-400',
                        ].join(' ')}
                      >
                        {getSignLabel(m.signStatus)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] text-gray-400">
                협약서에 {agreementDateLabel}까지 동의해주세요
              </p>
            </section>

            {/* 체결일 */}
            <section>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-4 text-center">
                <p className="text-[12px] text-gray-500">협약 체결일</p>
                <p className="mt-1 text-[16px] font-semibold text-gray-900">
                  {agreementDateLabel}
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* 피드백 */}
      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        className="fixed right-5 bottom-28 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg flex items-center justify-center"
        aria-label="협약서 피드백"
      >
        <img src={ImgFeedback} alt="피드백" />
      </button>

      <AgreementFeedbackBottomSheet
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* 확정 팝업 */}
      <ConfirmAgreementModal
        open={confirmOpen}
        confirming={confirming}
        onClose={() => {
          if (confirming) return;
          setConfirmOpen(false);
        }}
        onConfirm={handleConfirmAgreement}
      />

      {/* Bottom CTA */}
      <BottomCTAWrapper fixed>
        <BottomCTAButton
          label="작성 완료"
          disabled={!canOpenConfirm}
          onClick={handleClickWriteDone}
        />
      </BottomCTAWrapper>
    </div>
  );
}
