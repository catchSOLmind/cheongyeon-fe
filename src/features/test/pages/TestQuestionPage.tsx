// src/features/test/pages/TestQuestionPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestQuestions } from '../hooks/useTestQuestions';
import { useSubmitTest } from '../hooks/useSubmitTest';
import { TEST_QUESTION_IMAGES, DEFAULT_TEST_IMAGE } from '../data/testImages';
import type { TestAnswer } from '../types/test.types';

export default function TestQuestionPage() {
  const navigate = useNavigate();
  const { questions, error } = useTestQuestions();
  const isLoading = false;
  const { submitTest, isSubmitting } = useSubmitTest();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);

  const totalQuestions = questions?.length ?? 0;
  const currentQuestion = questions?.[currentIndex];

  const handleChoiceClick = async (choiceType: 'A' | 'B') => {
    if (!currentQuestion) return;

    const newAnswer: TestAnswer = {
      questionId: currentQuestion.questionId,
      choiceType,
    };

    const updatedAnswers = [
      ...answers.filter((a) => a.questionId !== currentQuestion.questionId),
      newAnswer,
    ];

    setAnswers(updatedAnswers);

    // 마지막 질문
    if (currentIndex === totalQuestions - 1) {
      const result = await submitTest(updatedAnswers);
      if (result) {
        navigate('/test/result', { state: { result } });
      } else {
        alert('테스트 제출에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    navigate('/calendar');
  };

  // 로딩
  if (isLoading || isSubmitting) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p>{isSubmitting ? '결과 분석 중...' : '로딩 중...'}</p>
      </div>
    );
  }

  // 질문이 아예 없음
  if (!error && totalQuestions === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <p className="text-body-l text-gray-600">표시할 질문이 없습니다.</p>
        <button
          onClick={() => navigate('/calendar')}
          className="px-6 py-2 bg-primary text-white rounded-lg"
        >
          홈으로
        </button>
      </div>
    );
  }

  // 에러 or 현재 질문 없음
  if (error || !currentQuestion) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <p className="text-body-l text-gray-600">질문을 불러올 수 없습니다.</p>
        <button
          onClick={() => navigate('/test')}
          className="px-6 py-2 bg-primary text-white rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-body-s text-gray-500">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center px-5 pt-8">
        <h1 className="text-title-l font-bold text-gray-900 text-center mb-2">
          {currentQuestion.content}
        </h1>
        <p className="text-body-m text-gray-600 text-center mb-8">
          나와 가장 가까운 선택지를 골라주세요
        </p>

        <img
          src={TEST_QUESTION_IMAGES[currentQuestion.order] || DEFAULT_TEST_IMAGE}
          alt={`질문 ${currentQuestion.order}`}
          className="w-[200px] h-auto mb-10"
        />

        <div className="w-full space-y-3">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice.choiceType}
              type="button"
              className="w-full min-h-[80px] px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-body-l text-gray-900 hover:border-primary hover:bg-primary-50 transition-all"
              onClick={() => handleChoiceClick(choice.choiceType)}
            >
              {choice.content}
            </button>
          ))}
        </div>
      </div>

      {/* 건너뛰기 */}
      <div className="flex justify-center py-6">
        <button
          type="button"
          className="text-body-s text-gray-400 underline underline-offset-4"
          onClick={handleSkip}
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
