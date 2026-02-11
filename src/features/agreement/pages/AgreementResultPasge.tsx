import { useEffect, useState } from 'react';
import ImgComplete from '@/assets/agreement/img-cheongyeon-agree.png'
import type { AgreementRuleItem } from '../types/ageement.types';
import { getAgreement } from '../api/agreementApi';
import type { AgreementDetail } from '../types/agreementDetail.types';
import { formatDateKR } from '@/shared/utils/formatDateKR';
import Header from '@/shared/components/Header';
import IconRed from '@/assets/agreement/icon-check-red.svg';
import IconBlue from '@/assets/agreement/icon-check-blue.svg';
import ImgStamp from '@/assets/agreement/img-stemp.svg';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { useNavigate } from 'react-router-dom';


// 첫번쨰로 진입 시 보여지는 협약서 완료 페이지
export default function AgreementResultPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [agreement, setAgreement] = useState<AgreementDetail | null>(null);
  const [, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return(
    <div className="min-h-screen bg-gray-50 relative">
      <Header title="우리 집 협약서" showBackButton/>
      {/**팝업 */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[300px] bg-white rounded-2xl px-6 py-8 flex flex-col items-center">
            <p className="text-display-xs text-black mb-3">
              합의서가 완성되었습니다!
            </p>
            <p className="text-body-s text-black mb-3 text-center">
              앞으로 서로 약속을 지키며 가사분담을 해봐요
            </p>
            <img
              src={ImgComplete}
              alt="완료 아이콘"
              className="w-[121px] h-[126px] mb-4"
            />

            <button
              onClick={() => setShowPopup(false)}
              className="w-full h-[51px] rounded-lg bg-primary-500 text-white text-body-l-bold"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <div className="pb-28">
        <div className="flex flex-col items-center mb-9 bg-white">
          <div className="pt-6 px-5 flex -space-x-2 mb-2">
              {(agreement?.members ?? []).map((member) => (
                <img
                  key={member.memberId}
                  src={member.profileImageUrl ?? '/assets/common/img-default-profile.png'}
                  className="w-14 h-14 rounded-full border border-white"
                />
              ))}
            </div>
          <p className="mt-[18px] font-sandoll font-normal text-[24px] text-black">
            {agreement?.houseName}
          </p>
        </div>

        <section className="bg-white px-5 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="mt-[16px] font-sandoll font-normal text-[16px] text-black">
              우리집 한 달 목표
            </h2>
            <button className="text-body-m-bold text-semantic-badge">수정</button>
          </div>
          <div className="bg-red-50 rounded-lg px-2 py-3 flex items-center gap-2 text-body-s text-gray-900">
            <img src={IconRed} className="w-5 h-5" />
            <span>{agreement?.monthlyGoal}</span>
          </div>
        </section>


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
                    <img src={IconBlue} className="w-5 h-5" />
                    <span className="text-body-m text-gray-900">
                      {rule.itemText}
                    </span>
                  </li>
                ))}
            </ul>
          </section>

          <div className="bg-white mt-10 relative h-24 flex items-center justify-center">
            {/* 중앙: 체결일 + 날짜 */}
            <div className="flex flex-col items-center">
              <p className="text-body-m text-black">협약 체결일</p>
              <p className="text-body-m-bold text-black">
                {agreement?.confirmedAt ? formatDateKR(agreement.confirmedAt) : ''}
              </p>
            </div>
            {/* 우측: 협약 완료 도장 */}
            <img
              src={ImgStamp}
              alt="협약 완료"
              className="absolute right-12 top-1/2 -translate-y-1/3 w-20"
            />
          </div>
      </div>
      <BottomCTAWrapper showTopBorder fixed>
      <BottomCTAButton 
        label='가사 분담 시작하기'
        onClick={() => navigate('/calendar')}
      />
    </BottomCTAWrapper>
      </div>
    );
}
