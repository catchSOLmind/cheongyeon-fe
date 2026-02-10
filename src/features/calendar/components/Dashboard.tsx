import React, { useEffect, useMemo, useState } from 'react';
import ImgHome from '@/assets/calendar/img-house.svg';
import ImgBanner from '@/assets/calendar/img-minigame.svg';
import IconRight from '@/assets/common/icon-right.svg';
import ImgCheongyeon from '@/assets/common/img-default-profile.svg'; 
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import type { GroupMember } from '@/shared/group/groupMembers.types';
import type { GroupDashboardResult } from '@/features/calendar/types/dashboard.types';
import { getGroupMembers } from '@/shared/group/groupMemberApi';
import { getGroupDashboard } from '@/features/calendar/api/dashBoardApi';
import Iconfire from '@/assets/calendar/dashboard/icon-fire.svg';
import Iconking from '@/assets/calendar/dashboard/icon-king.svg';
import IconCheck from '@/assets/calendar/dashboard/icon-checkpercent.svg';
import Icontop3 from '@/assets/calendar/dashboard/icon-top3.svg';


export function Dashboard() {
  const navigate = useNavigate();

  const groupId = useUserStore((s) => s.profile?.groupId ?? null);

  const [members, setMembers] = useState<GroupMember[]>([]);
  const [dashboard, setDashboard] = useState<GroupDashboardResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    let alive = true;

    const run = async () => {
      try {
        setLoading(true);

        const [membersRes, dashboardRes] = await Promise.all([
          getGroupMembers(groupId), 
          getGroupDashboard(groupId),
        ]);

        if (!alive) return;

        setMembers(membersRes.result.members);
        setDashboard(dashboardRes);
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
  }, [groupId]);

  const top5Members = useMemo(() => members.slice(0, 5), [members]);

  const streakDays = dashboard?.thisMonthStreakDays ?? 0;

  const daysInThisMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, []);

  const streakPct = useMemo(() => {
    if (daysInThisMonth <= 0) return 0;
    return Math.min(100, Math.max(0, (streakDays / daysInThisMonth) * 100));
  }, [streakDays, daysInThisMonth]);

  const cleaningKing = dashboard?.thisWeekCleaningKing ?? null;

  const completionRate = dashboard?.houseworkCompletionRate ?? 0;
  const safeRate = Math.min(100, Math.max(0, completionRate));

  const postponeTop3 = dashboard?.postponeTop3 ?? [];
  const maxPostpone = useMemo(() => {
    return postponeTop3.reduce((acc, cur) => Math.max(acc, cur.postponeCount), 0);
  }, [postponeTop3]);

  if (!groupId) {
    return (
      <div className="bg-white py-6">
        <div className="mx-auto w-full px-5 text-gray-600 text-body-m">
          그룹 정보가 없어요. (groupId가 null)
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-6">
      <div className="mx-auto w-full px-5">
        <h2 className="text-[16px] font-bold text-gray-900 mb-3">우리집 협약서</h2>

        <div className="rounded-2xl bg-white">
          <div>
            <div className="flex items-center gap-3 bg-primary-100 rounded-xl p-3">
              <img src={ImgHome} alt="home" className="h-10 w-10 rounded-full" />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-[1px] rounded-sm bg-semantic-notify text-white text-[10px] font-medium">
                    목표
                  </span>
                  <span className="text-[10px] text-black font-medium">30일 남음</span>
                </div>

                <p className="mt-2 text-[13px] leading-5 text-gray-800">
                  청소 점수 꼴등은 다음 달 화장실 청소 전담
                </p>
              </div>
            </div>

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
                  우리 동네
                  <br />
                  집안일 게임
                </p>
              </div>

              <button
                type="button"
                className="h-[28px] px-3 rounded-full bg-primary-50 text-primary-800 text-body-m-bold ml-2 mt-5"
              >
                도전하기
              </button>
            </div>
          </div>
        </div>

        {/* 우리집 관리 */}
        <div className="mt-6 flex items-center">
          <h2 className="text-body-m-bold text-gray-900">우리집 관리</h2>
          <img src={IconRight} className=" ml-1 h-5 w-5" />
        </div>

        {/* 카드: 멤버 */}
        <div className="mt-3 rounded-xl bg-white border border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-m-bold text-black mb-2">우리 집 멤버</p>

              {loading ? (
                <div className="text-body-s text-gray-400">불러오는 중…</div>
              ) : (
                <div className="flex -space-x-2">
                  {top5Members.map((m) => (
                    <div
                      key={m.memberId}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gray-900 overflow-hidden flex items-center justify-center"
                      title={m.nickname}
                    >
                      {m.profileImageUrl ? (
                        <img
                          src={m.profileImageUrl}
                          alt={m.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img src={ImgCheongyeon} className="w-5 h-5" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/test-start')}
              className="h-[34px] px-2 rounded-lg bg-[#424B4C] text-white text-body-m-bold mt-6"
            >
              가사 성향 테스트
            </button>
          </div>
        </div>

        {/* 지표 카드들 */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* 이번 달 연속 달성 */}
          <MetricCard>
            <div className="flex items-center gap-2">
              <img src={Iconfire} className='w-6 h-6'/>
              <p className="text-body-m-bold text-black">이번 달 연속 달성</p>
            </div>

            <div className="mt-1">
              <div className="flex items-center gap-1">
                  <p className="text-display-xs text-black">
                    {streakDays}
                  </p>
                  <p className="text-label-l">
                    일
                  </p>
                </div>
              <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${streakPct}%` }}
                />
              </div>
            </div>
          </MetricCard>

          {/* 이번 주 청소왕 */}
          <MetricCard>
            <div className="flex items-center gap-2">
              <img src={Iconking} className='w-6 h-6'/>
              <p className="text-body-m-bold text-black">이번 주 청소왕</p>
            </div>

            <div className="mt-[14px]">
              {!cleaningKing ? (
                <p className="text-body-s text-gray-400">아직 데이터가 없어요</p>
              ) : (
                <div className="mt-2 flex items-end justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-7 w-7 rounded-full bg-gray-200 overflow-hidden">
                      {cleaningKing.profileImageUrl ? (
                        <img
                          src={cleaningKing.profileImageUrl}
                          alt={cleaningKing.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img src={ImgCheongyeon} className="w-5 h-5 m-1" />
                      )}
                    </div>
                    <p className="text-[13px] font-bold text-gray-900">
                      {cleaningKing.nickname}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                  <p className="text-display-xs text-black">
                    {cleaningKing.completedCount}
                  </p>
                  <p className="text-label-l">
                    개 완료
                  </p>
                </div>
                 </div>
              )}
            </div>
          </MetricCard>

          {/* 가사 완료율 */}
          <MetricCard>
            <div className="flex items-center gap-2">
              <img src={IconCheck} className='w-6 h-6'/>
              <p className="text-body-m-bold text-black">가사 완료율</p>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <div className="mt-2 relative h-[100px] w-[100px] rounded-full">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#00BCD4 ${safeRate}%, #E5E7EB 0)`,
                  }}
                />
                <div className="absolute inset-[8px] rounded-full bg-white" />
                <div className="absolute inset-0 flex items-center justify-center text-display-xs text-gray-800">
                  {Math.round(safeRate)}%
                </div>
              </div>
            </div>
          </MetricCard>

          {/* 미루기 TOP3 */}
          <MetricCard>
            <div className="flex items-center gap-1">
              <img src={Icontop3} className='w-6 h-6'/>
              <p className="text-body-m-bold text-black">우리집 살림 TOP3</p>
            </div>

            <div className="mt-3 space-y-2">
              {postponeTop3.length === 0 ? (
                <p className="text-body-s text-gray-400">데이터가 없어요</p>
              ) : (
                postponeTop3.map((row) => (
                  <BarRow
                    key={row.memberId}
                    name={row.nickname}
                    value={maxPostpone === 0 ? 0 : row.postponeCount / maxPostpone}
                  />
                ))
              )}
            </div>

            <div className="mt-3">
              <button
                type="button"
                className="w-full h-[34px] px-2 rounded-lg bg-[#424B4C] text-white text-body-m-bold mt-4"
              >
                전체 보기
              </button>
            </div>
          </MetricCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-white border border-gray-300 p-3">{children}</div>;
}

function BarRow({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-label-m font-semibold text-gray-800">{name}</span>
        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>
  );
}
