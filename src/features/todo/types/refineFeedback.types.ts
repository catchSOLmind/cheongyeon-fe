// AI 피드백 문장 정제 (DB 저장 X)

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/**
 * 요청 바디
 * 순서 보장
 */
export interface RefineFeedbackRequest {
  contents: string[];
}

/**
 * 성공 시 result
 * 요청한 contents 순서와 동일
 */
export interface RefineFeedbackResult {
  refinedContents: string[];
}

/**
 * 최종 응답 타입
 */
export type RefineFeedbackResponse = ApiResponse<RefineFeedbackResult>;
