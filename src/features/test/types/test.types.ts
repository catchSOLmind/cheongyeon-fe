
// 성향테스트 질문 응답 타입
export interface TestQuestionsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    questions: TestQuestion[];
  };
}

// 성향테스트 질문
export interface TestQuestion {
  questionId: number;
  order: number;
  content: string;
  choices: TestChoice[];
}

// 성향테스트 선택지 타입 
export interface TestChoice {
  choiceType: 'A' | 'B';
  content: string;
}


// 테스트 제출
export interface SubmitTestRequest {
  answers: TestAnswer[];
}

// 테스트 답변 타입
export interface TestAnswer {
  questionId: number;
  choiceType: 'A' | 'B';
}

// 테스트 결과 응답
export interface TestResultResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TestResult;
}

// 중복 사용이 많아서 결과 타입 분리 
export type ResultType = 'PERFECTIONIST' | 'RELAXED' | 'EFFICIENT' | 'PROCRASTINATOR' | null ;

// 테스트 결과 타입
export interface TestResult {
  resultType: ResultType;
  title: string;
  subTitle: string;
  mainQuote: string;
  tags: string[];
  description: string;
  representativeLines: string[];
  cautionPoint: string;
}

