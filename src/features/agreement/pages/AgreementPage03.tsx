// src/features/agreement/pages/AgreementPage03.tsx
import { useEffect, useMemo, useState } from 'react';

import Header from '@/shared/components/Header';
import Steppers from '@/features/agreement/components/Steppers';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';

import AgreementFeedbackBottomSheet from '../components/AgreementFeedbackBottomSheet';
import ImgFeedback from '@/assets/agreement/icon-feedback-chat.svg';

import { getAgreement } from '@/features/agreement/api/agreementApi';
import type { AgreementDetail, AgreementRuleItem } from '@/features/agreement/types/agreementDetail.types';

export default function AgreementPage03() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [agreement, setAgreement] = useState<AgreementDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ 규칙 추가(로컬) 상태
  const [showRuleInput, setShowRuleInput] = useState(false);
  const [ruleInput, setRuleInput] = useState('');
  const [localRules, setLocalRules] = useState<AgreementRuleItem[]>([]);
  const maxRules = 5;

  /* =======================
   * 협약서 조회
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
        setLocalRules([]); // ✅ 새로 들어오면 로컬 추가 규칙 초기화(원하면 유지로 바꿔도 됨)
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

  // ✅ 화면에 보여줄 최종 규칙 = 서버 규칙 + 로컬 추가 규칙
  const mergedRules = useMemo(() => {
    const serverRules = agreement?.rules ?? [];
    return [...serverRules, ...localRules]
      .slice(0, maxRules)
      .sort((a, b) => (a.itemOrder ?? 0) - (b.itemOrder ?? 0));
  }, [agreement?.rules, localRules]);

  const canAddRule = useMemo(() => {
    const v = ruleInput.trim();
    if (!v) return false;
    if (mergedRules.length >= maxRules) return false;
    if (mergedRules.some((r) => r.itemText === v)) return false;
    return true;
  }, [ruleInput, mergedRules.length, mergedRules]);

  const handleAddRule = () => {
    if (!canAddRule) return;

    const v = ruleInput.trim();

    // 로컬 규칙은 임시 id 부여 (서버 itemId랑 안 겹치게 음수)
    const nextOrder = mergedRules.length;
    const newRule: AgreementRuleItem = {
      itemId: -Date.now(),
      itemOrder: nextOrder,
      itemText: v,
    };

    setLocalRules((prev) => [...prev, newRule]);
    setRuleInput('');
    setShowRuleInput(false);
  };

  const canSubmit = true;

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
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-[14px] text-gray-500">
            협약서를 불러오는 중이에요…
          </div>
        )}

        {/* Content */}
        {!loading && agreement && (
          <div className="mt-6 space-y-5">
            {/* 우리집 이름 */}
            <section>
              <label className="text-[12px] font-medium text-gray-700">
                우리집 이름
              </label>
              <div className="mt-2">
                <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px]">
                  {agreement.houseName}
                </div>
              </div>
            </section>

            {/* 한 달 목표 */}
            <section>
              <label className="text-[12px] font-medium text-gray-700">
                우리집 한 달 목표
              </label>
              <div className="mt-2">
                <div className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px]">
                  {agreement.monthlyGoal}
                </div>
              </div>
            </section>

            {/* 우리집 규칙 (추가 가능) */}
            <section>
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-gray-700">
                  우리집 규칙
                </label>
                <span className="text-[11px] text-gray-400">
                  필수 1개, 최대 {maxRules}개
                </span>
              </div>

              {/* rules */}
              <div className="mt-2 space-y-2">
                {mergedRules.map((r) => (
                  <div
                    key={r.itemId}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px]"
                  >
                    {r.itemText}
                  </div>
                ))}
              </div>

              {/* add ui */}
              {mergedRules.length < maxRules && (
                <div className="mt-3">
                  {!showRuleInput ? (
                    <button
                      type="button"
                      onClick={() => setShowRuleInput(true)}
                      className="w-full h-12 rounded-lg border border-gray-200 bg-white text-[14px] font-medium text-gray-800 flex items-center justify-center gap-2 active:bg-gray-50"
                    >
                      <span className="text-[18px] leading-none">+</span>
                      규칙 추가하기
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={ruleInput}
                        onChange={(e) => setRuleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddRule();
                          }
                        }}
                        placeholder="규칙을 입력해주세요"
                        className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowRuleInput(false);
                            setRuleInput('');
                          }}
                          className="flex-1 h-12 rounded-lg border border-gray-200 bg-white text-[14px] font-medium text-gray-700 active:bg-gray-50"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleAddRule}
                          disabled={!canAddRule}
                          className={[
                            'flex-1 h-12 rounded-lg text-[14px] font-medium',
                            canAddRule
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-400',
                          ].join(' ')}
                        >
                          추가
                        </button>
                      </div>

                      <p className="text-[11px] text-gray-400 flex justify-between">
                        <span>같은 규칙은 중복 추가할 수 없어요</span>
                        <span>{mergedRules.length}/{maxRules}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 멤버 동의 */}
            <section>
              <label className="text-[12px] font-medium text-gray-700">
                우리집 멤버 동의
              </label>

              <div className="mt-3 rounded-lg border border-gray-200 bg-white overflow-hidden">
                {agreement.members.map((m, idx) => {
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
                          <span className="text-[14px] text-gray-900">
                            {m.nickname}
                          </span>
                          {isOwner && (
                            <span className="px-2 h-6 rounded-full bg-gray-100 text-[12px] text-gray-500 flex items-center">
                              대표자
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={[
                          'px-3 h-7 rounded-full text-[12px] flex items-center justify-center',
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

      {/* Bottom CTA */}
      <BottomCTAWrapper fixed>
        <BottomCTAButton label="작성 완료" disabled={!canSubmit} onClick={() => {}} />
      </BottomCTAWrapper>
    </div>
  );
}
