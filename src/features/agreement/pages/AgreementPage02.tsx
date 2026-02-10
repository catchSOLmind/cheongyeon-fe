// src/features/agreement/pages/AgreementPage02.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '@/shared/components/Header';
import Steppers from '@/features/agreement/components/Steppers';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';

import { createAgreement } from '@/features/agreement/api/agreementApi';
import type { CreateAgreementRequest } from '@/features/agreement/types/ageement.types';

export default function AgreementPage02() {
  const navigate = useNavigate();

  const [houseName, setHouseName] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');

  const [ruleInput, setRuleInput] = useState('');
  const [rules, setRules] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const maxRules = 5;

  const getToday = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // yyyy-mm-dd
  };

  const canAddRule = useMemo(() => {
    const v = ruleInput.trim();
    if (!v) return false;
    if (rules.length >= maxRules) return false;
    if (rules.some((r) => r === v)) return false;
    return true;
  }, [ruleInput, rules]);

  const canSubmit = useMemo(() => {
    return (
      houseName.trim().length > 0 &&
      monthlyGoal.trim().length > 0 &&
      rules.length >= 1 &&
      !submitting
    );
  }, [houseName, monthlyGoal, rules.length, submitting]);

  const handleAddRule = () => {
    if (!canAddRule) return;
    const v = ruleInput.trim();
    setRules((prev) => [...prev, v]);
    setRuleInput('');
  };

  const handleRemoveRule = (idx: number) => {
    setRules((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload: CreateAgreementRequest = {
      deadline: getToday(), // 협약 체결일 = 오늘
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

      // 다음 단계: 멤버 초대 페이지
      navigate('/agreement/3', {
        state: { agreementId },
      });
    } catch {
        console.error('다시시도');
    } finally {
      setSubmitting(false);
    }
    };

  return (
    <div className="min-h-screen bg-white">
      <Header title="우리집 협약서" showBackButton />

      <div className="mx-auto w-full max-w-[390px] px-5 pb-28">
        {/* Stepper */}
        <div className="pt-3">
          <Steppers step={2} />
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-display-m text-black">
            협약서 초안을 작성해주세요
          </h1>
          <p className="mt-2 text-body-m text-gray-700">
            대표자가 초안 작성 후 멤버와 합의할 수 있어요
          </p>
        </div>

        {/* Form */}
        <div className="mt-10 space-y-6">
          {/* 우리집 이름 */}
          <section>
            <label className="text-body-l text-black">
              우리집 이름
            </label>
            <div>
              <input
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                placeholder="ex) 보송보송 우리집"
                className="mt-5 w-full h-11 px-3 rounded-lg bg-gray-100 text-body-m placeholder:text-gray-400"
              />
            </div>
          </section>

          {/* 한 달 목표 */}
          <section>
            <label className="text-body-l text-black">
              우리집 한 달 목표
            </label>
            <div>
              <input
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                placeholder="ex) 청소율 100% 달성 시 뷔페 가기"
                className="mt-5 w-full h-11 px-3 rounded-lg bg-gray-100 text-body-m placeholder:text-gray-400"
              />
            </div>
          </section>

          {/* 규칙 */}
          <section>
            <div className="flex items-center justify-between">
              <label className="text-body-l text-black">
                우리집 규칙
              </label>
              <span className="text-[12px] leading-[16px] text-gray-700">
                필수 1개, 최대 {maxRules}개
              </span>
            </div>

            {/* rules list (chip) */}
            {rules.length > 0 && (
              <div className="mt-5 flex flex-col  gap-2">
                {rules.map((r, idx) => (
                  <div
                    key={`${r}-${idx}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
                  >
                    <span className="text-[13px] leading-[18px] text-gray-800">
                      {r}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="규칙 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* rule input */}
            <div>
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
                className="mt-5 w-full h-11 px-3 rounded-lg bg-gray-100 text-body-m placeholder:text-gray-400"
                disabled={rules.length >= maxRules}
              />
            </div>

            {/* add button */}
            <button
              type="button"
              onClick={handleAddRule}
              disabled={!canAddRule}
              className={[
                'mt-[14px] w-full h-12 rounded-lg border text-[14px] leading-[20px] font-medium',
                'flex items-center justify-center gap-2',
                canAddRule
                  ? 'bg-white border-gray-200 text-gray-800 active:bg-gray-50'
                  : 'bg-gray-50 border-gray-200 text-gray-400',
              ].join(' ')}
            >
              <span className="text-[14px] leading-none">+</span>
              규칙 추가하기
            </button>

            {/* helper */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] leading-[16px] text-gray-400">
                같은 규칙은 중복 추가할 수 없어요
              </p>
              <p className="text-[11px] leading-[16px] text-gray-400">
                {rules.length}/{maxRules}
              </p>
            </div>
          </section>
        </div>
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
  );
}
