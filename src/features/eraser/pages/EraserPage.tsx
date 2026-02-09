import { useEffect, useMemo, useState } from 'react';
import Header from '@/shared/components/Header';
import ImgEraserResult from '@/assets/eraser/img-magic-result.png';
import ImgTime from '@/assets/eraser/img-total-time.png';
import ImgPoint from '@/assets/eraser/img-total-point.png';
import IconDown from '@/assets/eraser/icon-right-blue.svg';
import { useNavigate } from 'react-router-dom';

import type { EraserRecommendation } from '@/features/eraser/types/eraser.types';
import { getEraserRecommendations } from '@/features/eraser/api/eraserApi';

export default function EraserPage() {
  const [items, setItems] = useState<EraserRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        const res = await getEraserRecommendations();
        if (!alive) return;
        const list = res.result ?? [];
        setItems(list);
        setSelectedIds(new Set(list.map((it) => it.suggestionTaskId))); // 디폴트: 전체 선택
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = useMemo(() => {
    if (selectedIds.size === 0) return [];
    return items.filter((it) => selectedIds.has(it.suggestionTaskId));
  }, [items, selectedIds]);

  const totalMinutes = useMemo(() => {
    return selectedItems.reduce((sum, it) => sum + (it.defaultEstimatedMinutes ?? 0), 0);
  }, [selectedItems]);

  const totalPoints = useMemo(() => {
    return selectedItems.reduce((sum, it) => sum + (it.rewardPoint ?? 0), 0);
  }, [selectedItems]);

  // ✅ 하단 고정 버튼 영역에 가리지 않도록 페이지 전체에 여백만 추가
  const bottomSpacerClass = 'pb-[92px]';

  return (
    // ✅ h-dvh / flex / flex-col / overflow-hidden 제거 -> 페이지 전체 스크롤
    <div className={`bg-white ${bottomSpacerClass}`}>
      <Header title="청연 지우개" showBackButton />

      {/* 상단 이미지(가운데 정렬) */}
      <div className="flex justify-center pt-7">
        <img src={ImgEraserResult} alt="청연 지우개" className="w-[140px] h-[140px]" />
      </div>

      {/* 요약 카드 2개 */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {/* 시간 카드 */}
          <div className="rounded-xl border border-gray-300 overflow-hidden">
            <div className="bg-primary-50 pt-3 pb-2 flex flex-col items-center">
              <img src={ImgTime} className="mt-2 w-20 h-20" alt="" />
              <p className="mt-2 text-label-l text-primary-800 text-center">
                이번 달 누적 절약
              </p>
            </div>

            <div className="h-px bg-gray-300" />

            <div className="bg-white py-3">
              <p className="text-display-xs text-primary-800 text-center">
                {formatMinutes(totalMinutes) || '0분'}
              </p>
            </div>
          </div>

          {/* 포인트 카드 */}
          <div className="rounded-xl border border-gray-300 overflow-hidden">
            <div className="bg-primary-50 pt-3 pb-2 flex flex-col items-center">
              <img src={ImgPoint} className="mt-2 w-20 h-20" alt="" />
              <p className="mt-2 text-label-l text-primary-800 text-center">
                청연 지우개 포인트
              </p>
            </div>

            <div className="h-px bg-gray-300" />

            <div className="bg-white py-3">
              <p className="text-display-xs text-primary-800 text-center">
                {totalPoints.toLocaleString()}P
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-4 h-4 bg-[#FAFAFA]" />

      {/* 추천업무 헤더 */}
      <div className="px-6 mt-4 flex items-center justify-between">
        <p className="text-body-m-bold text-gray-800">추천업무</p>
        <button type="button" className="text-body-m-bold text-gray-800">
          더 보기
        </button>
      </div>

      {/* 추천업무 리스트 */}
      <div className="px-6 mt-3 pb-6">
        {loading ? (
          <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
            불러오는 중...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-5 text-body-s text-gray-500">
            추천 업무가 없어요.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((it) => (
              <RecommendationCard
                key={it.suggestionTaskId}
                item={it}
                selected={selectedIds.has(it.suggestionTaskId)}
                onToggleSelected={() => toggleSelected(it.suggestionTaskId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 버튼: 고정  */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-[385px] bg-white px-6 pb-6 pt-3">        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 h-14 rounded-xl bg-gray-200 text-body-l-bold text-gray-600"
            onClick={() => navigate('/calendar')}
          >
            취소
          </button>
          <button
            type="button"
            className="flex-1 h-14 rounded-xl bg-gray-800 text-white text-body-l-bold disabled:opacity-40"
            disabled={selectedItems.length === 0}
            onClick={() =>
              navigate('/eraser/apply', {
                state: {
                  suggestionTaskIds: selectedItems.map((it) => it.suggestionTaskId),
                },
              })
            }
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  item,
  selected,
  onToggleSelected,
}: {
  item: EraserRecommendation;
  selected: boolean;
  onToggleSelected: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isHighlighted = selected && !open;

  return (
    <div
      className={[
        'rounded-[20px] px-3 py-3 transition-colors',
        isHighlighted
          ? 'bg-primary-50 border border-primary-500'
          : 'bg-gray-50 border border-transparent',
      ].join(' ')}
      onClick={() => {
        if (open) return; // 펼쳐진 상태에서는 선택 토글 막기
        onToggleSelected();
      }}
      role="button"
      tabIndex={0}
    >
      {/* 상단 행 */}
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex flex-col">
            {/* 좌측 아이콘 */}
            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden">
              {item.imgUrl ? (
                <img
                  src={item.imgUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/common/img-placeholder.png';
                  }}
                />
              ) : (
                <span className="text-lg">🧽</span>
              )}
            </div>

            {/* 태그 */}
            {item.tags?.length ? (
              <div className="mt-4 flex flex-col gap-1">
                {item.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary-50 px-2 py-1 text-label-m text-secondary-500 text-center"
                  >
                    {tagLabel(t)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* 제목 */}
          <div>
            <p className="-mx-8 mt-1 text-body-l-bold text-gray-800">{item.title}</p>
          </div>
        </div>

        {/* 우측: 시간 + 토글 버튼 */}
        <div className="flex items-center gap-1">
          <span className="text-body-m-bold text-semantic-badge">
            {formatMinutes(item.defaultEstimatedMinutes)}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-label="상세 보기"
          >
            <img
              src={IconDown}
              alt=""
              className={`w-5 h-5 transition-transform duration-200 ${
                open ? 'rotate-90' : 'rotate-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 확장 영역 */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-3 border-t border-gray-200 pt-3">
          <p className="text-body-m text-gray-800 whitespace-pre-line">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function formatMinutes(min: number) {
  if (!min || min <= 0) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

function tagLabel(tag: string) {
  switch (tag) {
    case 'DELAYED':
      return '미루어진 작업';
    case 'NO_ASSIGNEE':
      return '무담당 작업';
    case 'GENERAL':
      return '시즌 추천';
    case 'REPEAT':
      return '반복 작업';
    default:
      return tag;
  }
}
