import { useCallback, useMemo, useState } from 'react';

export type FeedbackItem = {
  id: string;
  categoryId: string | null;
  text: string;
  isDropdownOpen: boolean;
};

type Options = {
  maxFeedbackCount?: number;   // 기본 5
  initialCount?: number;       // 기본 1
  maxLength?: number;          // 텍스트 자르기(선택). 기본 undefined면 안 자름
};

const createItem = (): FeedbackItem => ({
  id: crypto.randomUUID(), // 피드백별 고유 id 생성
  categoryId: null,
  text: '',
  isDropdownOpen: false,
});

export function useFeedbackFields(options: Options = {}) {
  const {
    maxFeedbackCount = 5,
    initialCount = 1,
    maxLength,
  } = options;

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(
    Array.from({ length: Math.max(1, initialCount) }, () => createItem())
  );

  /** 남은 추가 가능 여부 */
  const canAdd = useMemo(() => feedbacks.length < maxFeedbackCount, [feedbacks.length, maxFeedbackCount]);

  /** 특정 id 제외하고 전부 드롭다운 닫기 */
  const closeAllExcept = useCallback((keepId?: string) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        keepId && f.id === keepId ? f : { ...f, isDropdownOpen: false }
      )
    );
  }, []);

  /** 피드백 세트 추가 */
  const addFeedback = useCallback(() => {
    setFeedbacks((prev) => {
      if (prev.length >= maxFeedbackCount) return prev;
      // 새로 추가할 때는 기존 드롭다운들 닫고 새 항목 추가
      return prev.map((f) => ({ ...f, isDropdownOpen: false })).concat(createItem());
    });
  }, [maxFeedbackCount]);

  /** 피드백 세트 삭제 (최소 1개 유지) */
  const removeFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => {
      if (prev.length <= 1) return prev; // 최소 1개는 유지
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  /** 카테고리 드롭다운 토글: 한 번에 하나만 열리게 */
  const toggleCategoryDropdown = useCallback((id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f.id === id) return { ...f, isDropdownOpen: !f.isDropdownOpen };
        return { ...f, isDropdownOpen: false };
      })
    );
  }, []);

  /** 카테고리 선택: 선택하면 해당 항목만 값 설정 + 드롭다운 닫기 */
  const selectCategory = useCallback((id: string, categoryId: string) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, categoryId, isDropdownOpen: false } : f
      )
    );
  }, []);

  /** 텍스트 변경: (선택) maxLength가 있으면 잘라서 저장 */
  const changeText = useCallback((id: string, text: string) => {
    const nextText = typeof maxLength === 'number' ? text.slice(0, maxLength) : text;

    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, text: nextText } : f))
    );
  }, [maxLength]);

  /** 전체 초기화 */
  const resetFeedbacks = useCallback(() => {
    setFeedbacks(Array.from({ length: Math.max(1, initialCount) }, () => createItem()));
  }, [initialCount]);

  return {
    feedbacks,
    canAdd,
    addFeedback,
    removeFeedback,
    closeAllExcept,           
    toggleCategoryDropdown,
    selectCategory,
    changeText,
    resetFeedbacks,
  };
}
