import React from "react";

type ScoreItem = {
  label: string;
  value: number; // 0~100
};

const scores: ScoreItem[] = [
  { label: "꼼꼼함", value: 98 },
  { label: "착실함", value: 95 },
  { label: "유지력", value: 98 },
  { label: "대충력", value: 15 },
];

const badges = ["#청소왕", "#매일반짝반짝", "#먼지제로"];

const tasks = [
  { emoji: "🧽", title: "주방 후드 청소" },
  { emoji: "🧊", title: "냉장고 정리" },
  { emoji: "🚽", title: "변기 청소" },
];

export default function TestResultPage() {
  return (
    <div className="min-h-dvh bg-gray-50">
      {/* page container */}
      <div className="mx-auto w-full max-w-[420px] px-4 pb-28 pt-4">
        {/* 1) Top result card */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          {/* character header */}
          <div className="flex flex-col items-center">
            {/* image placeholder */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-sky-100">
              <div className="flex flex-col items-center px-4 py-6">
                <p className="text-sm text-gray-600">뿌득이</p>
                <p className="text-xs text-gray-500">완벽주의 청소왕</p>

                <div className="mt-4 h-[140px] w-[140px] rounded-full bg-white/60" />
                {/* ↑ 캐릭터 이미지 자리 */}
              </div>
            </div>

            {/* quote bubble */}
            <div className="-mt-4 w-full rounded-xl bg-gray-100 px-4 py-3 text-center text-sm text-gray-700">
              “청소는 선택이 아니라 그냥 기본이지”
            </div>

            {/* badges */}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* 2) Type score section */}
          <div className="mt-6">
            <h2 className="text-base font-semibold text-gray-900">뿌득이 유형은?</h2>
            <p className="mt-1 text-sm text-gray-500">
              보이는 먼지, 어질러진 물건은 지나칠 수 없어요.
              <br />
              한 번 시작한 청소는 끝을 보는 타입!
            </p>

            <div className="mt-4 space-y-3">
              {scores.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-sky-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3) Recommended tasks */}
          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">추천 가사업무</h3>
            <p className="mt-1 text-sm text-gray-500">
              디테일과 완벽함이 필요한 업무를 잘해요
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {tasks.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  className="rounded-2xl bg-white p-3 text-center shadow-sm"
                >
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="mt-2 text-xs font-medium text-gray-700">
                    {t.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4) Warning */}
          <div className="mt-4 rounded-2xl bg-yellow-50 p-4">
            <div className="flex gap-2">
              <div className="text-yellow-600">⚠️</div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">주의 포인트</h4>
                <p className="mt-1 text-sm text-gray-600">
                  기준이 너무 높아 스스로 피곤해질 수 있어요.
                  <br />
                  가끔은 “이정도면 충분해”라고 생각해봐요!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 5) bottom fixed actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="mx-auto flex w-full max-w-[420px] gap-3 px-4 py-3">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-lg"
            aria-label="다시하기"
            onClick={() => {
              // TODO: 다시하기 로직
            }}
          >
            ↻
          </button>

          <button
            type="button"
            className="h-12 flex-1 rounded-xl bg-sky-600 text-sm font-semibold text-white active:scale-[0.99]"
            onClick={() => {
              // TODO: 공유하기 로직
            }}
          >
            친구에게 공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
