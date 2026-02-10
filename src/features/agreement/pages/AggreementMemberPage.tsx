// src/features/agreement/pages/AgreementMemberPage.tsx
import { useEffect, useMemo, useState } from 'react';

import Header from '@/shared/components/Header';
import Steppers from '@/features/agreement/components/Steppers';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';

import AgreementFeedbackBottomSheet from '../components/AgreementFeedbackBottomSheet';
import ImgFeedback from '@/assets/agreement/icon-feedback-chat.svg';

import { getAgreement, signAgreement } from '@/features/agreement/api/agreementApi';
import type { AgreementDetail } from '@/features/agreement/types/agreementDetail.types';

export default function AgreementMemberPage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);

  const [agreement, setAgreement] = useState<AgreementDetail | null>(null);

  // 날짜 표시 (yy년 m월 d일)
  const formatKoreanDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    // deadline이 yyyy-mm-dd로 올 수도 있어서 안전 처리
    if (Number.isNaN(d.getTime())) {
      const [y, m, dd] = dateStr.split('-');
      if (!y || !m || !dd) return dateStr;
      return `${y.slice(2)}년 ${Number(m)}월 ${Number(dd)}일`;
    }
    const yy = String(d.getFullYear()).slice(2);
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    return `${yy}년 ${mm}월 ${dd}일`;
  };

  const fetchAgreement = async () => {
    try {
      setLoading(true);

      const res = await getAgreement();
      if (!res.isSuccess) return;

      setAgreement(res.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);

        const res = await getAgreement();
        if (!alive) return;

        if (!res.isSuccess) return;

        setAgreement(res.result);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  const agreementDateLabel = useMemo(() => {
    return formatKoreanDate(agreement?.deadline);
  }, [agreement?.deadline]);

  const houseName = agreement?.houseName ?? '';
  const monthlyGoal = agreement?.monthlyGoal ?? '';
  const rules = agreement?.rules ?? [];
  const members = agreement?.members ?? [];

  // ✅ 동의 버튼 활성 조건 (예시: agreement 있고, 서명 중 아니고, 로딩 중 아니고)
  const canSubmit = Boolean(agreement?.agreementId) && !loading && !signing;

  // ✅ 버튼 클릭 시 서명 API 호출
  const handleClickSign = async () => {
    const agreementId = agreement?.agreementId;
    if (!agreementId) return;
    if (signing) return;

    try {
      setSigning(true);

      const res = await signAgreement(agreementId);
      if (!res.isSuccess) return;

      // ✅ 필요하면 여기서 res.result.allSigned 보고 다음 화면 이동도 가능
      // if (res.result.allSigned) navigate('/agreement/complete')

      // ✅ UI 최신화: 다시 불러오기
      await fetchAgreement();
    } catch (e) {
      console.error(e);
    } finally {
      setSigning(false);
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
        <div className="mt-5">
          <h1 className="text-[20px] leading-[28px] font-semibold text-gray-900">
            협약서를 최종 확인해주세요
          </h1>
          <p className="mt-1 text-[12px] leading-[16px] text-gray-500">
            필요한 경우 멤버들이 피드백을 남겨요
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-[14px] leading-[20px] text-gray-500">
            협약서를 불러오는 중이에요…
          </div>
        )}

        {/* Content */}
        {!loading && agreement && (
          <div className="mt-6 space-y-5">
            {/* 우리집 이름 */}
            <section>
              <label className="text-[12px] leading-[16px] font-medium text-gray-700">
                우리집 이름
              </label>
              <div className="mt-2">
                <div className="w-full min-h-12 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px] leading-[20px] text-gray-900">
                  {houseName}
                </div>
              </div>
            </section>

            {/* 우리집 한 달 목표 */}
            <section>
              <label className="text-[12px] leading-[16px] font-medium text-gray-700">
                우리집 한 달 목표
              </label>
              <div className="mt-2">
                <div className="w-full min-h-12 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px] leading-[20px] text-gray-900">
                  {monthlyGoal}
                </div>
              </div>
            </section>

            {/* 우리집 규칙 */}
            <section>
              <div className="flex items-center justify-between">
                <label className="text-[12px] leading-[16px] font-medium text-gray-700">
                  우리집 규칙
                </label>
                <span className="text-[11px] leading-[16px] text-gray-400">
                  필수 1개, 최대 5개
                </span>
              </div>

              <div className="mt-2 space-y-2">
                {rules.map((r) => (
                  <div
                    key={r.itemId}
                    className="w-full min-h-12 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px] leading-[20px] text-gray-900"
                  >
                    {r.itemText}
                  </div>
                ))}
              </div>
            </section>

            {/* 우리집 멤버 동의 */}
            <section>
              <label className="text-[12px] leading-[16px] font-medium text-gray-700">
                우리집 멤버 동의
              </label>

              <div className="mt-3 rounded-lg border border-gray-200 bg-white overflow-hidden">
                {members.map((m, idx) => {
                  const agreed = m.signStatus === 'SIGNED';
                  const isOwner = m.role === 'OWNER';

                  return (
                    <div
                      key={m.memberId}
                      className={[
                        'flex items-center justify-between px-4 py-3',
                        idx !== 0 ? 'border-t border-gray-100' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                          {m.profileImageUrl ? (
                            <img
                              src={m.profileImageUrl}
                              alt={`${m.nickname} avatar`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[12px] text-gray-500">🙂</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[14px] leading-[20px] text-gray-900">
                            {m.nickname}
                          </span>

                          {isOwner && (
                            <span className="px-2 h-6 rounded-full bg-gray-100 text-[12px] leading-[24px] text-gray-500 flex items-center">
                              대표자
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={[
                          'px-3 h-7 rounded-full text-[12px] leading-[28px] flex items-center justify-center',
                          agreed
                            ? 'bg-primary-50 text-primary-600'
                            : 'bg-gray-100 text-gray-400',
                        ].join(' ')}
                      >
                        {agreed ? '동의완료' : '대기중'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] leading-[16px] text-gray-400">
                협약서에 {agreementDateLabel}까지 동의해주세요
              </p>
            </section>

            {/* 체결일 카드 */}
            <section>
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-4 text-center">
                <p className="text-[12px] leading-[16px] text-gray-500">
                  협약 체결일
                </p>
                <p className="mt-1 text-[16px] leading-[22px] font-semibold text-gray-900">
                  {agreementDateLabel}
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Empty fallback (agreement 없을 때) */}
        {!loading && !agreement && (
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-[14px] leading-[20px] text-gray-500">
            아직 협약서가 없어요.
          </div>
        )}
      </div>

      {/* Floating feedback button + feedback sheet */}
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

      {/* Bottom button */}
      <BottomCTAWrapper fixed>
        <BottomCTAButton
          label={signing ? '동의 처리중…' : '검토 완료 및 동의'}
          disabled={!canSubmit}
          onClick={handleClickSign}
        />
      </BottomCTAWrapper>
    </div>
  );
}
