import type { CategoryType } from '@/features/todo/types/category.types';
import type { PraiseTypeCode } from './feedback.types';
import type { ApiResponse } from '@/shared/types/ApiResponse';


export interface FeedbackImprovementItem {
  category: CategoryType; // 예: "BATHROOM"
  rawText: string;        // 원본(사용자 입력)
  aiText: string;         // AI 변환본
}

/** 피드백 제출 요청 바디 */
export interface SubmitFeedbackRequest {
  targetMemberId: number;
  praiseTypes: PraiseTypeCode[];
  improvements?: FeedbackImprovementItem[]; 
}

export type SubmitFeedbackResponse = ApiResponse<Record<string, never>>;
