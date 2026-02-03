import React from "react";
import ImgHome from '@/assets/calendar/img-house.svg';
import ImgBanner from '@/assets/calendar/img-minigame.svg';
import IconRight from '@/assets/common/icon-right.svg';
import { useNavigate } from "react-router-dom";


type Member = { id: string; name: string; avatarUrl?: string };

const members: Member[] = [
  { id: "1", name: "멤버1" },
  { id: "2", name: "멤버2" },
  { id: "3", name: "멤버3" },
  { id: "4", name: "멤버4" },
  { id: "5", name: "멤버5" },
];

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-5">
        {/*산돌폰트 적용 하기*/}
        <h2 className="text-[16px] font-bold text-gray-900 mb-3">우리집 협약서</h2>

        <div className="rounded-2xl bg-white">
            <div>
            <div className="flex items-center gap-3 bg-primary-100 rounded-xl p-3">
              {/* 왼쪽 아이콘 */}
              <img src={ImgHome} alt="home" 
                className="h-10 w-10 rounded-full"/>

              {/* 텍스트 */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-[1px] rounded-sm bg-semantic-notify text-white text-[10px] font-medium">
                    목표
                  </span>
                  <span className="text-[10px] text-black font-medium">30일 남음</span>
                </div>

                {/*산돌폰트 적용 하기*/}
                <p className="mt-2 text-[13px] leading-5 text-gray-800"> 
                  청소 점수 꼴등은 다음 달 화장실 청소 전담
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <button
              type="button"
              className="mt-4 w-full h-[42px] rounded-lg border border-gray-200 bg-gray-50 text-body-m text-gray-800"
            >
              우리집 협약서 확인
            </button>
          </div>
        </div>

        {/* 배너 */}
        <div className="mt-7 rounded-[20px] overflow-hidden bg-white">
          <div className="relative h-[78px]">
            <img
              src={ImgBanner}
              alt="미니게임 배너"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative h-full px-4 flex items-center">
              <div className="text-white">
                <p className="text-body-m-bold">
                    우리 동네<br />
                    집안일 게임</p>
              </div>

              <button
                type="button"
                className="h-[28px] px-3 rounded-full bg-primary-50 text-primary-800 text-body-m-bold ml-2 mt-5">
                도전하기
              </button>

            </div>
          </div>
        </div>

        {/* 우리집 관리 */}
        <div className="mt-6 flex items-center">
          {/* 산돌 폰트로 변경 필요 */}
          <h2 className="text-body-m-bold text-gray-900">우리집 관리</h2>
          <img src={IconRight} className=" ml-1 h-5 w-5" />
        </div>

        {/* 카드: 멤버 */}
        <div className="mt-3 rounded-xl bg-white border border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-m-bold text-black mb-2">우리집 멤버</p>

              <div className="flex -space-x-2">
                {members.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-700"
                    title={m.name}
                  >
                    {m.name.replace("멤버", "")}
                  </div>
                ))}
              </div>
            </div>

            <button
            type="button"
            onClick={() => navigate("/test-start")}
            className="h-[34px] px-2 rounded-lg bg-gray-800 text-white text-body-m-bold mt-6"
          >
            가사 성향 테스트
          </button>
          </div>
        </div>

        {/* 지표 카드들 */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* 이번 달 연속 달성 */}
          <MetricCard>
            <div className="flex items-center">
              <span className="text-[24px]">🔥</span>
              <p className="text-body-m-bold text-black">이번 달 연속 달성</p>
            </div>
            <div className="mt-2">
              <p className="text-[18px] font-extrabold text-gray-900">4일</p>
              <div className="mt-2 h-[6px] rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full w-[40%] bg-gray-800 rounded-full" />
              </div>
            </div>
          </MetricCard>

          {/* 이번 달 청소왕 */}
          <MetricCard>
            <div className="flex items-center">
              <span className="text-[24px]">🔥</span>
              <p className="text-body-m-bold text-black">이번 달 청소왕</p>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-200" />
                <p className="text-[13px] font-bold text-gray-900">안중원</p>
              </div>
              <p className="text-[13px] font-bold text-gray-900">6개 완료</p>
            </div>
          </MetricCard>

          {/* 가사 완료율 */}
          <MetricCard>
            <div className="flex items-center">
              <span className="text-[24px]">🔥</span>
              <p className="text-body-m-bold text-black">가사 완료율</p>
            </div>

            <div className="mt-3 flex items-center gap-3">
              {/* 도넛 */}
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-[8px] border-gray-200" />
                <div
                  className="absolute inset-0 rounded-full border-[8px] border-[#FF5A5F]"
                  style={{
                    clipPath: "inset(0 0 0 50%)",
                    transform: "rotate(120deg)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[12px] font-extrabold text-gray-900">
                  30%
                </div>
              </div>

              <div>
                <p className="text-[12px] text-gray-500">전체 약 30개</p>
              </div>
            </div>
          </MetricCard>

          {/* 우리집 살림 TOP3 */}
          <MetricCard>
            <div className="flex items-center">
              <span className="text-[24px]">🔥</span>
              <p className="text-body-m-bold text-black">우리집 살림 TOP3</p>
            </div>

            <div className="mt-3 space-y-2">
              <BarRow label="실행왕" value={0.85} />
              <BarRow label="청소왕" value={0.65} />
              <BarRow label="기타" value={0.45} />
            </div>

            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E9FAFF] text-[#0EA5B7] text-[12px] font-bold">
                버튼버튼버튼버튼
              </span>
            </div>
          </MetricCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-gray-300 p-3">
      {children}
    </div>
  );
}

function BarRow({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-[11px] font-semibold text-gray-600">{label}</span>
      <div className="flex-1 h-[8px] rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full rounded-full bg-[#FF5A5F]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
