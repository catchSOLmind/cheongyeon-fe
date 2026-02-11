// src/features/agreement/pages/AgreementMainPage.tsx
import { useEffect, useState } from 'react';

import type { AgreementRuleItem } from '../types/ageement.types';
import { getAgreement } from '../api/agreementApi';
import type { AgreementDetail } from '../types/agreementDetail.types';

import { formatDateKR } from '@/shared/utils/formatDateKR';
import Header from '@/shared/components/Header';

import IconRed from '@/assets/agreement/icon-check-red.svg';
import IconBlue from '@/assets/agreement/icon-check-blue.svg';
import ImgStamp from '@/assets/agreement/img-stemp.svg';

// 홈 화면에서 보여지는 협약서 완료 페이지
export default function AgreementMainPage() {
  const [agreement, setAgreement] = useState<AgreementDetail | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await getAgreement();
        if (!alive) return;

        setAgreement(res.result);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const rules: AgreementRuleItem[] = agreement?.rules ?? [];
  const members = agreement?.members ?? [];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header title="우리 집 협약서" showBackButton />

      <div className="pb-28">
        {/* 상단: 멤버 아바타 + 집 이름 + 확인 멤버 */}
        <div className="flex flex-col items-center mb-9 bg-white">
          <div className="pt-6 px-5 flex -space-x-2 mb-2">
            {members.map((member) => (
              <img
                key={member.memberId}
                src={
                  member.profileImageUrl ??
                  '/assets/common/img-default-profile.png'
                }
                className="w-14 h-14 rounded-full border border-white object-cover bg-gray-200"
                alt={`${member.nickname ?? '멤버'} 프로필`}
              />
            ))}
          </div>

          <p className="mt-[18px] font-sandoll font-normal text-[24px] text-black">
            {agreement?.houseName ?? ''}
          </p>
        </div>

        {/* 우리집 한 달 목표 */}
        <section className="bg-white px-5 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="mt-[16px] font-sandoll font-normal text-[16px] text-black">
              우리집 한 달 목표
            </h2>
            <button className="text-body-m-bold text-semantic-badge">수정</button>
          </div>

          <div className="bg-red-50 rounded-lg px-2 py-3 flex items-center gap-2 text-body-s text-gray-900">
            <img src={IconRed} className="w-5 h-5" alt="" />
            <span>{agreement?.monthlyGoal ?? ''}</span>
          </div>
        </section>

        {/* 우리집 규칙 */}
        <section className="bg-white px-5 mb-8">
          <h2 className="mt-[16px] font-sandoll font-normal text-[16px] text-black mb-4">
            우리집 규칙
          </h2>

          <ul className="space-y-3">
            {rules
              .slice()
              .sort((a, b) => a.itemOrder - b.itemOrder)
              .map((rule) => (
                <li
                  key={rule.itemId}
                  className="flex items-center gap-3 bg-[#EFFBFD] px-2 py-3 rounded-lg"
                >
                  <img src={IconBlue} className="w-5 h-5" alt="" />
                  <span className="text-body-m text-gray-900">
                    {rule.itemText}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        {/* 확인 멤버 리스트*/}
          <div className="w-full bg-white mt-5 px-5 pb-6">
            <h2 className="mt-[16px] font-sandoll font-normal text-[16px] text-black mb-4">
              확인 멤버
            </h2>

            <div className="mt-3 space-y-2">
              {members.map((m) => {
                const signedDateLabel = m.signedAt ? formatDateKR(m.signedAt) : '';
                const tagLabel = m.role === 'OWNER' ? '대표자' : '멤버'; 

                return (
                  <div
                    key={m.memberId}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 flex items-center justify-between"
                  >
                    {/* left */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
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
                        <span className="text-[14px] leading-[20px] font-medium text-gray-900">
                          {m.nickname}
                        </span>

                        <span className="px-3 h-6 rounded-lg bg-primary-50 text-primary-600 text-[12px] leading-[28px] flex items-center">
                          {tagLabel}
                        </span>
                      </div>
                    </div>

                    {/* right */}
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] leading-[16px] text-gray-800">
                        {signedDateLabel || '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* 체결일 + 도장 */}
        <div className="bg-white mt-10 relative h-24 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <p className="text-body-m text-black">협약 체결일</p>
            <p className="text-body-m-bold text-black">
              {agreement?.confirmedAt ? formatDateKR(agreement.confirmedAt) : ''}
            </p>
          </div>

          <img
            src={ImgStamp}
            alt="협약 완료"
            className="absolute right-12 top-1/2 -translate-y-1/3 w-20"
          />
        </div>
      </div>
    </div>
  );
}
