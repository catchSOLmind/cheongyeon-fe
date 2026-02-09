import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';

import type { EraserSuggestionTaskWithOptions } from '@/features/eraser/types/eraserOptions.types';
import { getEraserOptions } from '@/features/eraser/api/eraserApi';

type LocationState = {
  suggestionTaskIds?: number[];
};

export default function EraserApplyPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  const suggestionTaskIds = state?.suggestionTaskIds ?? [];

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<EraserSuggestionTaskWithOptions[]>([]);

  // 선택된 옵션(optionId) 저장: taskId -> optionId
  const [selectedOptionByTaskId, setSelectedOptionByTaskId] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    if (suggestionTaskIds.length === 0) return;

    let alive = true;

    const run = async () => {
      try {
        setLoading(true);

        const res = await getEraserOptions({ suggestionTaskId: suggestionTaskIds });
        if (!alive) return;

        const list = res.result ?? [];
        setTasks(list);

        // 디폴트: 각 task의 첫 번째 옵션 선택
        const init: Record<number, number> = {};
        list.forEach((t) => {
          const first = t.options?.[0];
          if (first) init[t.suggestionTaskId] = first.optionId;
        });
        setSelectedOptionByTaskId(init);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [suggestionTaskIds]);

  const totalPrice = useMemo(() => {
    return tasks.reduce((sum, t) => {
      const selectedOptionId = selectedOptionByTaskId[t.suggestionTaskId];
      const opt = t.options?.find((o) => o.optionId === selectedOptionId);
      return sum + (opt?.price ?? 0);
    }, 0);
  }, [tasks, selectedOptionByTaskId]);


  // 직접 진입 방지
  if (suggestionTaskIds.length === 0) {
    return (
      <div className="min-h-dvh bg-white">
        <Header title="청연지우개" showBackButton />
        <div className="px-6 pt-6">
          <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
            선택된 업무가 없어요. 이전 화면에서 선택 후 이동해주세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white flex flex-col overflow-hidden">
      <Header title="청연지우개" showBackButton />

      {/* 리스트(스크롤) */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="py-4">
          {loading ? (
            <div className="px-5">
              <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
                불러오는 중...
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-5">
              <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
                옵션 정보가 없어요.
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {tasks.map((t, idx) => {
                const selectedOptionId = selectedOptionByTaskId[t.suggestionTaskId];
                const selectedOpt = t.options?.find((o) => o.optionId === selectedOptionId);

                return (
                  <div key={t.suggestionTaskId}>
                    <div className="px-5">
                      <section className="pb-6">
                        {/* 상단 정보 */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-display-xs text-gray-900">{t.title}</p>

                            <div className="mt-2 flex flex-col gap-1">
                              <p className="text-body-m text-gray-900">
                                개수 : {selectedOpt?.count ?? '-'}
                              </p>
                              <p className="text-body-m text-gray-900">
                                소요시간 : {formatMinutes(selectedOpt?.estimatedMinutes ?? 0)}
                              </p>
                            </div>
                          </div>

                          {/* 썸네일 */}
                          <div className="w-[64px] h-[64px] rounded-xl bg-white overflow-hidden flex-shrink-0">
                            {t.imgUrl ? (
                              <img
                                src={t.imgUrl}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/assets/common/img-placeholder.png';
                                }}
                              />
                            ) : null}
                          </div>
                        </div>

                        {/* 옵션 버튼들 */}
                        <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
                          {t.options?.map((opt) => {
                            const active = opt.optionId === selectedOptionId;

                            return (
                              <button
                                key={opt.optionId}
                                type="button"
                                onClick={() =>
                                  setSelectedOptionByTaskId((prev) => ({
                                    ...prev,
                                    [t.suggestionTaskId]: opt.optionId,
                                  }))
                                }
                                className={[
                                  'min-w-[100px] rounded-xl border px-4 py-3 text-start transition-colors',
                                  active
                                    ? 'border-black bg-[#f7f7f7]'
                                    : 'border-gray-200 bg-white',
                                ].join(' ')}
                              >
                                <p className="text-display-xs text-black">{opt.count}</p>
                                <p className="mt-1 text-body-m text-gray-800">
                                  {formatMinutes(opt.estimatedMinutes)} 소요
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    </div>

                    {/* 회색 구분선: 마지막 아이템은 제외 */}
                    {idx !== tasks.length - 1 && <div className="mb-6 h-4 bg-[#FAFAFA]" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 바 */}
      <div className="flex-shrink-0 bg-white px-6 pb-6 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-l-bold text-black">{totalPrice.toLocaleString()}원</p>
            <button type="button" className="mt-1 text-body-m text-gray-500">
              자세히
            </button>
          </div>

          <button
              type="button"
              className="h-14 px-10 rounded-lg bg-primary-500 text-white text-body-m-bold"
              onClick={() => {
                // 큐로 쌓아서 최종 제출 
                const queue = tasks.map((t) => ({
                  suggestionTaskId: t.suggestionTaskId,
                  optionId: selectedOptionByTaskId[t.suggestionTaskId],
                  title: t.title,
                  imgUrl: t.imgUrl ?? null,
                }));

                console.log('queue:', queue);

                navigate('/eraser/date', {
                  state: {
                    queue,
                    done: [],
                    usedPoint: 0,
                  },
                });
              }}
            >
              다음
            </button>
        </div>

        {/* <p className="mt-2 text-body-s text-gray-500">
          총 소요시간: {formatMinutes(totalMinutes)}
        </p> */}
      </div>
    </div>
  );
}

function formatMinutes(min: number) {
  const minutes = Math.max(0, Math.floor(min || 0));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}