import { useCallback, useMemo, useState } from 'react';
import type { CategoryType } from '../types/category.types';

export type FeedbackItem = {
  id: string;
  categoryType: CategoryType | null;
  text: string;
  isDropdownOpen: boolean;
};

type Options = {
  maxFeedbackCount?: number;
  initialCount?: number;
  maxLength?: number;
};

const createItem = (): FeedbackItem => ({
  id: crypto.randomUUID(),
  categoryType: null,
  text: '',
  isDropdownOpen: false,
});

export function useFeedbackFields(options: Options = {}) {
  const { maxFeedbackCount = 5, initialCount = 1, maxLength } = options;

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(
    Array.from({ length: Math.max(1, initialCount) }, () => createItem())
  );

  const canAdd = useMemo(
    () => feedbacks.length < maxFeedbackCount,
    [feedbacks.length, maxFeedbackCount]
  );

  const closeAllExcept = useCallback((keepId?: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (keepId && f.id === keepId ? f : { ...f, isDropdownOpen: false }))
    );
  }, []);

  const addFeedback = useCallback(() => {
    setFeedbacks((prev) => {
      if (prev.length >= maxFeedbackCount) return prev;
      return prev.map((f) => ({ ...f, isDropdownOpen: false })).concat(createItem());
    });
  }, [maxFeedbackCount]);

  const removeFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const toggleCategoryDropdown = useCallback((id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => {
        if (f.id === id) return { ...f, isDropdownOpen: !f.isDropdownOpen };
        return { ...f, isDropdownOpen: false };
      })
    );
  }, []);

  // CategoryType 선택
  const selectCategory = useCallback((id: string, categoryType: CategoryType) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, categoryType, isDropdownOpen: false } : f))
    );
  }, []);

  const changeText = useCallback(
    (id: string, text: string) => {
      const nextText = typeof maxLength === 'number' ? text.slice(0, maxLength) : text;
      setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, text: nextText } : f)));
    },
    [maxLength]
  );

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
