/** 공통 백엔드 응답 */
export interface BackendResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type EraserRecommendationTag =
  | 'DELAYED'
  | 'NO_ASSIGNEE'
  | 'GENERAL'
  | 'REPEAT';

/** 청연 지우개 추천 업무 단건 */
export interface EraserRecommendation {
  suggestionTaskId: number;
  title: string;
  imgUrl: string;
  defaultEstimatedMinutes: number;
  rewardPoint: number;
  tags: EraserRecommendationTag[];   
  description: string;
}

/** GET /api/eraser/recommendations 응답 */
export type GetEraserRecommendationsResponse =
  BackendResponse<EraserRecommendation[]>;
