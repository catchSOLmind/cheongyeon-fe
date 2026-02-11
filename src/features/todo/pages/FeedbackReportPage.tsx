// src/features/feedback/pages/FeedbackReportPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ImgDefault from '@/assets/common/img-default-profile.svg';
import { categories } from '@/features/todo/data/categoryTypeImages';
import type {
  WeeklyFeedbackResponse,
  WeeklyFeedbackResult,
} from '@/features/todo/types/weeklyFeedback.types';

import { getFeedbackReport } from '@/features/todo/api/feedbackApi';
import Header from '@/shared/components/Header';

import ImgBanner from '@/assets/calendar/img-topbanner.svg';

import type { PraiseTypeCode } from '@/features/todo/types/feedback.types';
import { complimentStickers } from '../data/feedbackStamps';

function CategoryBadge({
  category,
}: {
  category: WeeklyFeedbackResult['myImprovements'][number]['category'];
}) {
  const found = useMemo(() => {
    const byType = categories.find((c) => c.categoryType === category);
    return {
      label: byType?.name ?? '기타',
      icon: byType?.image,
    };
  }, [category]);

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center overflow-hidden">
        {found.icon ? (
          <img src={found.icon} alt={found.label} className="w-8 h-8" />
        ) : (
          <span className="text-xs text-gray-400">🧹</span>
        )}
      </div>
      <span className="text-body-m-bold text-gray-900">{found.label}</span>
    </div>
  );
}

/** 칭찬 스티커: code로 아이콘 매핑해서 렌더 */
function StampChip({ code, title }: { code: PraiseTypeCode; title: string }) {
  const sticker = useMemo(
    () => complimentStickers.find((s) => s.id === code),
    [code]
  );

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary-50">
      {sticker ? (
        <img
          src={sticker.iconFill}
          alt={title}
          className="w-4 h-4 object-contain"
        />
      ) : null}
      <span className="text-primary-700 text-body-s-bold">{title}</span>
    </div>
  );
}

export default function FeedbackReportPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<WeeklyFeedbackResult | null>(null);
  const [loading, setLoading] = useState(true);

  // 개선 피드백 카드 펼침/접힘
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res: WeeklyFeedbackResponse = await getFeedbackReport();
        if (!alive) return;

        setData(res.result);
      } catch (e) {
        console.error('[getFeedbackReport] error:', e);
        if (!alive) return;
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const toggleOpen = (idx: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center text-gray-500">
        불러오는 중…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-dvh bg-white flex flex-col items-center justify-center gap-3">
        <p className="text-gray-600">리포트를 불러오지 못했어요.</p>
        <button
          className="px-4 py-2 rounded-lg bg-gray-100"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>
    );
  }

  const {
    period,
    groupTitle,
    summaries,
    myPraiseStamp,
    myImprovements,
    memberFeedbacks,
  } = data;

  return (
    <div className="min-h-dvh bg-white">
      {/* 상단바 */}
      <Header title="우리 집 리포프" />

      {/* 상단 히어로 */}
      <div className="bg-primary-50 px-5 pt-6 pb-8">
        <p className="text-center text-display-xs text-gray-800">{period}</p>
        <p className="mt-6 text-center text-display-xs text-gray-800">우리는..</p>

        <div className="mt-3 flex justify-center">
          <span className="px-3 py-2 bg-[#FFF1CC] rounded-lg font-sandoll font-normal text-body-l-bold text-primary-900">
            “{groupTitle}”
          </span>
        </div>

        {/* 캐릭터 자리 (원하면 이미지로 교체) */}
        <div className="mt-5 flex justify-center">
          <img src={ImgBanner} className="w-[190px] h-[84px]" alt="" />
        </div>

        {/* 요약 카드 */}
        <div className="-mt-4 rounded-2xl bg-white px-4 py-4">
          <div className="space-y-2">
            {(summaries ?? [])
              .slice(0, 3)
              .map((s, idx) => (
                <div key={`${idx}-${s}`} className="flex items-start gap-2">
                  <span className="mt-[2px] text-yellow-400">★</span>
                  <p className="text-body-m text-gray-800">{s}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-5 py-6">
        {/* 나의 피드백 */}
        <h2 className="font-sandoll text-body-l-bold text-gray-900">나의 피드백</h2>

        {/* 칭찬 스티커 */}
        <div className="mt-3">
          <p className="text-label-m text-gray-600">칭찬 스티커</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(myPraiseStamp ?? []).length === 0 ? (
              <span className="text-body-s text-gray-400">
                이번 주 칭찬 스티커가 없어요.
              </span>
            ) : (
              myPraiseStamp.map((s) => (
                <StampChip
                  key={`${s.code}-${s.title}`}
                  code={s.code as PraiseTypeCode}
                  title={s.title}
                />
              ))
            )}
          </div>
        </div>

        {/* 개선 피드백 */}
        <div className="mt-6">
          <p className="tont-sandoll text-body-l-bold text-gray-900">개선 피드백</p>

          {(myImprovements ?? []).length === 0 ? (
            <div className="mt-3 text-body-s text-gray-400">
              개선 피드백이 없어요.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {myImprovements.map((item, idx) => {
                const isOpen = openSet.has(idx);

                return (
                  <div
                    key={`${idx}-${item.authorName}`}
                    className="rounded-2xl bg-white border border-gray-100"
                  >
                    <button
                      type="button"
                      onClick={() => toggleOpen(idx)}
                      className="w-full px-4 py-4 flex items-start justify-between gap-3 text-left"
                    >
                      <div className="min-w-0">
                        <CategoryBadge category={item.category} />

                        <p className="mt-2 text-body-m text-gray-800 line-clamp-2">
                          {item.content}
                        </p>

                        {isOpen ? (
                          <p className="mt-2 text-body-s text-gray-500">
                            from{' '}
                            <span className="inline-flex items-center gap-1">
                              <img
                                src={item.profileImageUrl ?? ImgDefault}
                                alt={item.authorName}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              {item.authorName}
                            </span>
                          </p>
                        ) : null}
                      </div>

                      <span className="text-gray-400">{isOpen ? '▴' : '▾'}</span>
                    </button>

                    {isOpen ? (
                      <div className="px-4 pb-4">
                        <p className="text-body-m text-gray-800 whitespace-pre-line">
                          {item.content}
                        </p>

                        <div className="mt-3 flex justify-end">
                          <div className="text-body-s text-gray-500 inline-flex items-center gap-1">
                            from
                            <img
                              src={item.profileImageUrl ?? ImgDefault}
                              alt={item.authorName}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{item.authorName}</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 멤버 피드백 */}
        <div className="mt-8">
          <h2 className="text-body-l-bold text-gray-900">멤버 피드백</h2>

          {(memberFeedbacks ?? []).length === 0 ? (
            <div className="mt-3 text-body-s text-gray-400">
              멤버 피드백이 없어요.
            </div>
          ) : (
            <div className="mt-3 space-y-5">
              {memberFeedbacks.map((m) => (
                <div key={m.memberId} className="space-y-2">
                  <p className="text-body-m-bold text-gray-900">{m.nickname}</p>
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="text-body-m text-gray-800">
                      {m.latestFeedbackContent}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
