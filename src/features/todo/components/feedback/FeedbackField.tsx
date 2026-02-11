import DropdownSelect from '@/features/todo/components/feedback/DropdownSelect';

import { categories } from '@/features/todo/data/categoryTypeImages';
import type { CategoryType } from '@/features/todo/types/category.types';
import CategoryChoiceItem from './CategoryChoiceItem';
import ImgAi from '@/assets/todo/feedback/img-cheongyeon-ai.png'

type Props = {
  labelId: string;
  value: string;
  maxLength: number;

  categoryType?: CategoryType;
  categoryName?: string;

  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onSelectCategory: (category: CategoryType) => void;
  onChangeText: (text: string) => void;

  // AI 정제 UI
  isRefined?: boolean;          // 하늘색 채우기
  showAiBox?: boolean;          // textarea 아래 박스 표시 여부
  isRefiningThis?: boolean;     // 해당 필드가 지금 로딩중인지
  onRollback?: () => void;      // 해당 필드만 되돌리기
};

export default function FeedbackField({
  value,
  maxLength,
  categoryType,
  categoryName,
  isDropdownOpen,
  onToggleDropdown,
  onSelectCategory,
  onChangeText,

  isRefined = false,
  showAiBox = false,
  isRefiningThis = false,
  onRollback,
}: Props) {
  return (
    <div className="mb-6">
      {/* =========================
       * 카테고리 선택
       * ========================= */}
      <div className="mb-4">
        <DropdownSelect
          isOpen={isDropdownOpen}
          onToggle={onToggleDropdown}
          selectedValue={categoryName ?? null}
          placeholder="카테고리를 선택해주세요"
          showProfile = {true}
          selectedImage={
          categories.find((c) => c.categoryType === categoryType)?.image}
          displayValue={categoryName}
        >
          <div className="px-4 py-2 flex flex-col gap-2">
            {categories
              .filter((c) => c.categoryType !== '') // 즐겨찾기 제외
              .map((c) => (
                <CategoryChoiceItem
                  key={c.categoryType}
                  categoryType={c.categoryType as CategoryType}
                  name={c.name}
                  image={c.image}
                  isSelected={c.categoryType === categoryType}
                  // 중요: onSelectCategory는 (category) => void 이므로 래핑해서 호출
                  onClick={() => onSelectCategory(c.categoryType as CategoryType)}
                />
              ))}
          </div>
        </DropdownSelect>
      </div>

      {/* =========================
       * 피드백 입력
       * ========================= */}
      <textarea
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="예: 설거지할 때 그릇 뒤쪽도 닦아주면 좋을 것 같아요"
        className={[
          'bg-white border-gray-300 w-full h-[162px] px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary border text-body-m',
          isRefined ? 'text-primary-800' : 'text-gray-800',
        ].join(' ')}
      />

      <p className="text-body-s text-gray-400 mt-2 text-left">
        글자수 제한:{' '}
        <span className="text-semantic-badge">{value.length}</span>/{maxLength}
      </p>

      {/* =========================
       *  textarea 아래 AI 로딩/완료 박스
       * - 로딩 중: 스피너
       * - 완료 후: "다듬어 봤어요" + 되돌리기
       * ========================= */}
      {showAiBox && (
  <>
    {/* 1) 진행중 UI */}
    {isRefiningThis ? (
      <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 왼쪽 아이콘 */}
          <img src={ImgAi} alt="ai" className="h-8 w-8" />

          {/* 점 3개 로딩 */}
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-bounce [animation-delay:240ms]" />
          </div>
        </div>

        {/* 오른쪽은 비워두거나(스크린샷처럼) 자리만 유지 */}
        <div className="w-10" />
      </div>
    ) : (
      /* 2) 완료 UI */
      <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* 왼쪽 아이콘 */}
          <img src={ImgAi} alt="ai" className="h-8 w-8" />
          <p className="text-label-m text-primary-600">청연이 AI로 다듬어 봤어요!</p>
        </div>

        <button
          type="button"
          onClick={onRollback}
          className="h-8 px-3 rounded-full bg-[#2A2A2A] text-white text-body-s flex items-center gap-1"
        >
          {/* 되돌리기 아이콘(원하면 교체) */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path
              d="M3 12a9 9 0 1 0 3-6.708"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 4v6h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          되돌리기
        </button>
      </div>
    )}
  </>
)}
    </div>
  );
}
