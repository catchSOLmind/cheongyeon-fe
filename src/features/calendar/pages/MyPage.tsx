// MyPage.tsx
import React, { useEffect, useState } from "react";
import type { ResultType } from "@/features/test/types/test.types";
import { getProfile } from "@/features/calendar/api/profileApi";
import type { ProfileResponse } from "@/features/calendar/types/profile.types";

const TYPE_META = new Map<ResultType, { emoji: string }>([
  ["PERFECTIONIST", { emoji: "🧼" }],
  ["RELAXED", { emoji: "🛋️" }],
  ["EFFICIENT", { emoji: "⚡️" }],
  ["PROCRASTINATOR", { emoji: "⏳" }],
  [null, { emoji: "🧩" }],
]);

const formatMonthLabel = (ym?: string) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  return `${y.slice(2)}년 ${Number(m)}월`;
};

export default function MyPage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await getProfile(); // ✅ 여기서 호출
        if (!alive) return;

        setData(res);
      } catch {
        if (!alive) return;
        setErrorMsg("조회 실패");
        setData(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);


  const totalCount = data?.monthlyActivity?.totalCount ?? 0;

  if (loading) {
    return (
      <div className="min-h-dvh bg-sky-50 px-4 py-8">
        <div className="rounded-2xl bg-white p-4">불러오는 중…</div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-dvh bg-sky-50 px-4 py-8">
        <div className="rounded-2xl bg-white p-4">
          {errorMsg ?? "조회 실패"}
        </div>
      </div>
    );
  }

  const { profile, personalityInfo, summary, monthlyActivity } = data;

  return (
    <div className="min-h-dvh bg-sky-50">
      {/* 상단바 */}
      <div className="sticky top-0 z-10 bg-sky-50 px-4 pt-3 pb-2">
        <div className="relative flex justify-center items-center">
          <button
            className="absolute left-0 h-10 w-10 flex items-center justify-center"
            onClick={() => window.history.back()}
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-[16px] font-semibold">마이페이지</h1>
        </div>
      </div>

      <div className="px-4 pb-8">
        {/* 프로필 */}
        <div className="mt-4 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-white ring-4 ring-white overflow-hidden flex items-center justify-center">
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <p className="mt-4 text-[18px] font-semibold">{profile.nickname}</p>
        </div>

        {/* 나의 성향 */}
        <div className="mt-6 bg-white rounded-2xl px-4 py-4">
          <button className="w-full flex items-center justify-between">
            <span className="text-[14px] font-semibold">나의 성향</span>
            <span className="text-gray-400">›</span>
          </button>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              {TYPE_META.get(personalityInfo.houseworkType)?.emoji}
            </div>

            {personalityInfo.houseworkType === null ? (
              <button
                type="button"
                className="text-[14px] font-semibold text-primary underline"
                onClick={() => {
                  // TODO: 성향 테스트 페이지로 이동
                }}
              >
                성향 테스트 하러가기
              </button>
            ) : (
              <span className="text-[14px] font-semibold">
                {personalityInfo.houseworkTypeLabel}
              </span>
            )}
          </div>
        </div>

        {/* 이번 달 성과 */}
        <div className="mt-4 bg-white rounded-2xl px-4 py-4">
          <p className="text-[14px] font-semibold mb-3">이번 달 성과</p>

          <div className="grid grid-cols-3 gap-3">
            <Stat
              icon="🔥"
              value={summary ? `${summary.streakDays}일` : "-"}
              label="연속 달성"
            />
            <Stat
              icon="🪙"
              value={summary ? summary.totalPoints.toLocaleString() : "-"}
              label="청소 포인트"
            />
            <Stat
              icon="✅"
              value={summary ? `${summary.completedTaskCount}개` : "-"}
              label="완료한 할 일"
            />
          </div>
        </div>

        {/* 이번 달 활동 */}
        <div className="mt-4 bg-white rounded-2xl px-4 py-4">
          <button className="w-full flex items-center justify-between">
            <span className="text-[14px] font-semibold">이번 달 활동</span>
            <span className="text-gray-400">›</span>
          </button>

          {!monthlyActivity ? (
            <div className="mt-3 text-[13px] text-gray-500">
              이번 달 활동 데이터가 없어요.
            </div>
          ) : (
            <>
              <p className="mt-2 text-[12px] text-gray-500">
                {formatMonthLabel(monthlyActivity.month)}
              </p>

              <div className="mt-2 h-10 rounded-2xl overflow-hidden flex bg-gray-100">
                {monthlyActivity.categories.map((c, i) => (
                  <div
                    key={c.categoryName}
                    className={[
                      "bg-pink-100",
                      "bg-sky-100",
                      "bg-amber-100",
                      "bg-emerald-100",
                    ][i % 4]}
                    style={{
                      width:
                        totalCount > 0
                          ? `${(c.count / totalCount) * 100}%`
                          : "0%",
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {monthlyActivity.categories.map((c) => (
                  <div key={c.categoryName} className="flex gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-sky-50 flex items-center justify-center">
                      🧹
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold">
                        {c.categoryName} {c.count}번
                      </p>
                      <p className="text-[12px] text-gray-500">
                        내가 맡은 일의 {c.mySharePercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl py-4">
      <span className="text-xl">{icon}</span>
      <span className="text-[18px] font-semibold">{value}</span>
      <span className="text-[12px] text-gray-500">{label}</span>
    </div>
  );
}
