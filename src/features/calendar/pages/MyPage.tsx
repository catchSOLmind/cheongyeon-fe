// MyPage.tsx
import { useEffect, useState } from "react";
import type { ResultType } from "@/features/test/types/test.types";
import { getProfile } from "@/features/calendar/api/profileApi";
import type { ProfileResponse } from "@/features/calendar/types/profile.types";
import Img01 from '@/assets/calendar/mypage/img-mypage-01.svg';
import Img02 from '@/assets/calendar/mypage/img-mypage-02.svg';
import Img03 from '@/assets/calendar/mypage/img-mypage-03.svg';
import { useNavigate } from "react-router-dom";


const TYPE_META = new Map<ResultType, { emoji: string }>([
  ["PERFECTIONIST", { emoji: "🧼" }],
  ["RELAXED", { emoji: "🛋️" }],
  ["EFFICIENT", { emoji: "⚡️" }],
  ["PROCRASTINATOR", { emoji: "⏳" }],
]);

const DEFAULT_TYPE_EMOJI = "🧩";

const formatMonthLabel = (ym?: string) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  return `${y.slice(2)}년 ${Number(m)}월`;
};

export default function MyPage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await getProfile();
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
    <div className="sticky top-0 z-20 bg-sky-50 px-4 pt-3 pb-2">
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

    {/* 프로필 오버랩 영역 */}
    <div className="relative">
      {/* 큰 흰 원(배경 장식) */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 h-[80px] w-[80px] rounded-full bg-white shadow-sm" />

      {/* 프로필/닉네임 */}
      <div className="relative z-10 flex flex-col items-center pt-7 pb-10">
        <div className="h-[72px] w-[72px] rounded-full overflow-hidden flex items-center justify-center">
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
    </div>

    <div className="px-4 pb-8 -mt-32">
      {/* 나의 성향 */}
      <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
        <button className="w-full flex items-center justify-between">
          <span className="text-[14px] font-semibold">나의 성향</span>
          <span className="text-gray-400">›</span>
        </button>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
            {personalityInfo.houseworkType
              ? (TYPE_META.get(personalityInfo.houseworkType)?.emoji ??
                DEFAULT_TYPE_EMOJI)
              : DEFAULT_TYPE_EMOJI}
          </div>

          {!personalityInfo.houseworkType ? (
            <button
              type="button"
              className="text-[14px] font-semibold text-primary underline"
              onClick={() => navigate('/test-start')}
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
            img={Img01}
            value={summary ? `${summary.streakDays}일` : "-"}
            label="연속 달성"
          />
          <Stat
            img={Img02}
            value={summary ? summary.totalPoints.toLocaleString() : "-"}
            label="청소 포인트"
          />
          <Stat
            img={Img03}
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
  img,
  value,
  label,
}: {
  img: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <img src={img} alt={label} className="w-[46px] h-[55px]" />
      <span className="text-display-s text-black mt-[10px]">{value}</span>
      <span className="text-body-m text-gray-600 ">{label}</span>
    </div>
  );
}
