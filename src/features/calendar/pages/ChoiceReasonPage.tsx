/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState, useEffect } from 'react';
import Header from '@/shared/components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import type { PostponeReasonCode } from '../types/myTaskEdit.types';
import { POSTPONE_REASON_LABEL, POSTPONE_REASON_LIST } from '../data/postponeReason';
import { postponeMyTask } from '../api/myTaskEditApi';

import { categories } from '@/features/todo/data/categoryTypeImages';
import type { CategoryType } from '@/features/todo/types/category.types';

type NavState = {
  occurrenceId: number;
  taskName: string;
  categoryType: CategoryType;
  fromDate: string; // "YYYY-MM-DD" or "1월 21일 (수)" whatever 너가 넘긴 값
  fromTime: string; // "HH:mm"
  toDate: string;   // "YYYY-MM-DD"
  toTime: string;   // "HH:mm"
};

export default function ChoiceReasonPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    occurrenceId,
    taskName,
    categoryType,
    fromDate,
    toDate,
    toTime,
  } = (state ?? {}) as Partial<NavState>;

  const [selected, setSelected] = useState<PostponeReasonCode>('ANOTHER_SCHEDULE');
  const [customText, setCustomText] = useState('');

  // 새로고침/직접 접근 방지: 렌더 중 navigate 금지 -> effect로 처리
  useEffect(() => {
    if (!occurrenceId) navigate('/calendar', { replace: true });
  }, [occurrenceId, navigate]);

  if (!occurrenceId) return null;

  const isEtc = selected === 'ETC';
  const maxLen = 200;

  const canSubmit = useMemo(() => {
    if (selected !== 'ETC') return true;
    return customText.trim().length > 0;
  }, [selected, customText]);

  // 카테고리 아이콘 매핑
  const categoryImage =
    categories.find((c) => c.categoryType === categoryType)?.image ?? undefined;

  return (
    <div className="min-h-dvh bg-white">
      <Header title="이유 선택하기" showBackButton />

      <div className="px-5 pt-5 pb-28">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {categoryImage ? (
              <img src={categoryImage} alt={String(categoryType)} className="w-6 h-6" />
            ) : null}
          </div>

          <div className="flex flex-col">
            <p className="text-body-m-bold text-gray-900">{taskName ?? ''}</p>
            <p className="text-body-s text-gray-600">
              {/* from → to */}
              {fromDate ?? ''}{' '}
              <span className="text-gray-400"> → </span>
              <span className="text-primary">
                {toDate ?? ''}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-gray-200" />

        <h2 className="mt-6 text-display-xs text-black">
          일정을 미루는 이유가 <br /> 무엇인가요?
        </h2>

        {/* Chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {POSTPONE_REASON_LIST.map((code) => {
            const active = selected === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelected(code)}
                className={[
                  'px-4 py-2 rounded-full border text-body-m',
                  active
                    ? 'border-primary bg-primary-50 text-gray-800'
                    : 'border-gray-200 bg-white text-gray-800',
                ].join(' ')}
              >
                {POSTPONE_REASON_LABEL[code]}
              </button>
            );
          })}
        </div>

        {/* ETC 입력 */}
        {isEtc && (
          <div className="mt-10">
            <p className="text-body-m-bold text-gray-900">사유를 직접 입력해주세요</p>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value.slice(0, maxLen))}
              placeholder="예: 다른 사람이 이미 했어요"
              className="mt-3 w-full h-40 rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-2 text-body-s text-gray-400">
              {customText.length}/{maxLen}
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 pb-5 ">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-14 rounded-lg bg-gray-200 text-gray-600 text-body-m-bold"
            onClick={() => navigate('/calendar')}
          >
            취소
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            className={[
              'h-14 rounded-lg text-body-m-bold',
              canSubmit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400',
            ].join(' ')}
            onClick={async () => {
              if (!toDate || !toTime) return;

              await postponeMyTask(occurrenceId, {
                date: toDate,
                time: toTime,
                postponeReasonCode: selected,
                postponeReasonText: selected === 'ETC' ? customText.trim() : null,
              });

              navigate('/calendar');
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
