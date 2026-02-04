// src/features/test/pages/TestQuestionPage.tsx
import { useNavigate } from 'react-router-dom';
import { useTestQuestions } from '../hooks/useTestQuestions';
import { useSubmitTest } from '../hooks/useSubmitTest';
import { TEST_QUESTION_IMAGES, DEFAULT_TEST_IMAGE } from '../data/testImages';
import Header from '@/shared/components/Header'; 
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { useTestFlow } from '../hooks/useTestFlow';

export default function TestQuestionPage() {
  const navigate = useNavigate();
  // 질문 데이터 불러오기 
  const { questions, loading,error } = useTestQuestions();
  const { submitTest, isSubmitting } = useSubmitTest();

  const flow = useTestFlow({
    questions,
    submitTest,
    // 제출 후 결과 페이지로 결과값 전달 
    onFinish: (result) =>
      navigate('/test-result', { state: { result } }),
  });

  const { currentQuestion } = flow;

  // 스킵
  const handleSkip = () => {
    navigate('/calendar');
    console.log('Test skipped, navigating to /calendar');
  };

  // 로딩
  if (loading || isSubmitting) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p>{isSubmitting ? '결과 분석 중...' : '로딩 중...'}</p>
      </div>
    );
  }

  // 질문이 아예 없음
  if (!loading && !error && flow.totalQuestions === 0) {
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
      <div>
      <Header title="청소 성향 테스트" showBackButton  />
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <p className="text-body-l text-gray-600">질문을 불러올 수 없습니다.</p>
        <button
          onClick={() => navigate('/test-start')}
          className="px-6 py-2 bg-primary text-white rounded-lg"
        >
          다시 시도
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-white flex flex-col">
      <Header title="청소 성향 테스트" showBackButton />
      {/* Progress Bar */}
      <div className="px-5 pt-7">
        {/* bar */}
        <div className="h-[6px] w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((flow.currentIndex + 1) / flow.totalQuestions) * 100}%` }}
          />
        </div>

        {/* text under bar (right aligned) */}
        <div className="mt-2 flex justify-end">
          <span className="text-label-l text-gray-600 leading-none">
            {flow.currentIndex + 1}/{flow.totalQuestions}
          </span>
        </div>
      </div>


      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center px-5 pt-12">
        <h1 className="text-display-m text-black text-center mb-2">
          {currentQuestion.content}
        </h1>
        <p className="text-body-l-bold text-gray-600 text-center mb-6">
          나와 가장 가까운 선택지를 골라주세요
        </p>

        <img
          src={TEST_QUESTION_IMAGES[currentQuestion.order] || DEFAULT_TEST_IMAGE}
          alt={`질문 ${currentQuestion.order}`}
          className="w-[151px] h-auto mb-6"
        />

       <div className="w-full space-y-4">
          {currentQuestion.choices.map((choice) => {
            const isSelected = flow.selectedChoice === choice.choiceType;
            const isDimmed =
              flow.selectedChoice !== null && flow.selectedChoice !== choice.choiceType;

            return (
              <button
                key={choice.choiceType}
                type="button"
                onClick={() => flow.handleSelectChoice(choice.choiceType)}
                // 선택분기에 따른 조건부 스타일링 
                className={`
                  w-full h-[56px] px-5 py-4 rounded-2xl border
                  transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary-50 text-gray-800' // 선택된 경우
                      : isDimmed
                      ? 'border-gray-300 bg-white text-gray-500' // 비선택된 경우
                      : 'border-gray-300 bg-white text-gray-800'  // 기본 상태
                  }
                `}
              >
                {choice.content}
      </button>
        );
      })}
    </div>
  </div>

      {/* 건너뛰기 */}
      <div className="flex justify-center py-1">
        <button
          type="button"
          className="text-label-l-regular text-gray-600 underline underline-offset-4"
          onClick={handleSkip}
        >
          건너뛰기
        </button>
      </div>
      <BottomCTAWrapper sticky>
        <BottomCTAButton
          onClick={flow.handleNext}
          label="다음"
        />
      </BottomCTAWrapper>
    </div>
  );
} 
