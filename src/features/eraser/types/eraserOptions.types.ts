// src/features/eraser/types/eraserOptions.types.ts

/** 공통 응답 래퍼 */
export interface EraserOptionsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: EraserSuggestionTaskWithOptions[];
}

export interface EraserSuggestionTaskWithOptions {
  suggestionTaskId: number;
  title: string;
  imgUrl: string;
  options: EraserSuggestionOption[];
}


// 옵션 세부 
export interface EraserSuggestionOption {
  optionId: number;
  count: string;
  estimatedMinutes: number;
  price: number;
}

/** 요청 쿼리 파라미터 타입 */
export interface GetEraserOptionsParams {
  suggestionTaskId: number[];
}
