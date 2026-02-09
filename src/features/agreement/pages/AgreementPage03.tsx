// src/features/agreement/pages/AgreementPage03.tsx
import { useMemo, useState } from 'react';
import Header from '@/shared/components/Header';
import Steppers from '@/features/agreement/components/Steppers';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import AgreementFeedbackBottomSheet from '../components/AgreementFeedbackBottomSheet';
import ImgFeedback from '@/assets/agreement/icon-feedback-chat.svg'

type MemberAgreeStatus = 'PENDING' | 'AGREED';

type Member = {
  id: number;
  name: string;
  avatarUrl?: string | null;
  status: MemberAgreeStatus;
};

export default function AgreementPage03() {
  // 더미 데이터 (나중에 API로 대체)
  const [houseName] = useState('보송보송 우리집');
  const [monthlyGoal] = useState('청소율 100% 달성 시 뷔페 가기');
  const [rules] = useState<string[]>([
    '빨래 뒤집어서 놓지 않기',
    '주에 한 번 일괄 보고 청소 칭찬 해주기',
  ]);

  const [members] = useState<Member[]>([
    { id: 1, name: '문지우', avatarUrl: null, status: 'PENDING' },
    { id: 2, name: '심지영', avatarUrl: null, status: 'PENDING' },
    { id: 3, name: '윤시진', avatarUrl: null, status: 'PENDING' },
    { id: 4, name: '안종원', avatarUrl: null, status: 'PENDING' },
  ]);

  const [feedbackOpen, setFeedbackOpen] = useState(false);


  const agreementDateLabel = useMemo(() => {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(2);
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    return `${yy}년 ${mm}월 ${dd}일`;
  }, []);

  const canSubmit = useMemo(() => {
    // UI 단계라 일단 활성화 조건은 단순화
    return true;
  }, []);

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

        {/* Form Blocks */}
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
              {rules.map((r, idx) => (
                <div
                  key={`${r}-${idx}`}
                  className="w-full min-h-12 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-[14px] leading-[20px] text-gray-900"
                >
                  {r}
                </div>
              ))}

              <button
                type="button"
                className="w-full h-12 rounded-lg border border-gray-200 bg-white text-[14px] leading-[20px] font-medium text-gray-800 flex items-center justify-center gap-2 active:bg-gray-50"
              >
                <span className="text-[18px] leading-none">+</span>
                규칙 추가하기
              </button>
            </div>
          </section>

          {/* 우리집 멤버 동의 */}
          <section>
            <label className="text-[12px] leading-[16px] font-medium text-gray-700">
              우리집 멤버 동의
            </label>

            <div className="mt-3 rounded-lg border border-gray-200 bg-white overflow-hidden">
              {members.map((m, idx) => (
                <div
                  key={m.id}
                  className={[
                    'flex items-center justify-between px-4 py-3',
                    idx !== 0 ? 'border-t border-gray-100' : '',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {m.avatarUrl ? (
                        <img
                          src={m.avatarUrl}
                          alt={`${m.name} avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[12px] text-gray-500">🙂</span>
                      )}
                    </div>
                    <span className="text-[14px] leading-[20px] text-gray-900">
                      {m.name}
                    </span>
                  </div>

                  <span
                    className={[
                      'px-3 h-7 rounded-full text-[12px] leading-[28px] flex items-center justify-center',
                      m.status === 'AGREED'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-gray-100 text-gray-400',
                    ].join(' ')}
                  >
                    {m.status === 'AGREED' ? '동의완료' : '대기중'}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] leading-[16px] text-gray-400">
              협약서에 {agreementDateLabel}까지 동의해주세요
            </p>
          </section>

          {/* 체결일 카드 */}
          <section>
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-4 text-center">
              <p className="text-[12px] leading-[16px] text-gray-500">협약 체결일</p>
              <p className="mt-1 text-[16px] leading-[22px] font-semibold text-gray-900">
                {agreementDateLabel}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Floating feedback button + feedback sheet */}
      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        className="fixed right-5 bottom-28 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg flex items-center justify-center"
        >
        <img src = {ImgFeedback}/>
        </button>

        <AgreementFeedbackBottomSheet
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        />


      {/* Bottom button */}
      <BottomCTAWrapper fixed>
        <BottomCTAButton label="작성 완료" disabled={!canSubmit} onClick={() => {}} />
      </BottomCTAWrapper>
    </div>
  );
}
