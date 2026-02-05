// src/features/test/hooks/useTestFlow.ts
// 페이지에서 받아온 훅 인덱스 관리,질문 계산,선택,다음,제출
import { useState } from "react";
import type { TestAnswer , TestQuestion } from "../types/test.types";

export function useTestFlow<TResult>(params : {
    questions: TestQuestion[] | null;
    submitTest: (answers: TestAnswer[]) => Promise<TResult | null>;
    onFinish: (result: TResult) => void;
}) {

    const { questions, submitTest, onFinish } = params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
    const [answers, setAnswers] = useState<TestAnswer[]>([]);

    const totalQuestions = questions?.length ?? 0;
    const currentQuestion = questions?.[currentIndex];

    const handleSelectChoice = (choiceType: 'A' | 'B') => {
        setSelectedChoice(choiceType);
    };

    // 다음 질문 or 제출
    const handleNext = async () => {
    if (!selectedChoice || !currentQuestion) return;

    const newAnswer: TestAnswer = {
        questionId: currentQuestion.questionId,
        choiceType: selectedChoice,
    };

    // 기존 답변 업데이트
    const updatedAnswers = [
    ...answers.filter((a) => a.questionId !== currentQuestion.questionId),
    newAnswer,
    ];

    // 답변 업데이트,초기화
    setAnswers(updatedAnswers);
    setSelectedChoice(null);

    // 마지막 질문 확인
    const isLast = currentIndex === totalQuestions - 1;

    if (isLast) {
      const result = await submitTest(updatedAnswers);
      if (result !== null) {
        onFinish(result);
      }
      else{
        alert('테스트 제출에 실패했습니다.');
        return;
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    };
    
    return {
    currentIndex,
    totalQuestions,
    currentQuestion,
    selectedChoice,
    handleSelectChoice,
    handleNext,
  };
}