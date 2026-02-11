import type { FeedbackPageLoadResponse } from '@/features/todo/types/feedback.types';
import { authenticatedClient } from "@/features/auth/api/client";
import type { WeeklyFeedbackResponse } from '../types/weeklyFeedback.types';
import type { RefineFeedbackRequest, RefineFeedbackResponse } from '../types/refineFeedback.types';


export const getFeedbackTemplate = async (): Promise<FeedbackPageLoadResponse> => {
  const { data } = await authenticatedClient.get<FeedbackPageLoadResponse>(
    '/feedback'
  );
  return data;
};


//최종 피드백 리포트를 받아온다
export const getFeedbackReport = async (): Promise<WeeklyFeedbackResponse> => {
  const { data } = await authenticatedClient.get<WeeklyFeedbackResponse>(
    '/feedback/report'
  );
  return data;
};

/**
 * POST /api/feedback/refine
 */
export const postRefineFeedback = async (
  body: RefineFeedbackRequest
): Promise<RefineFeedbackResponse> => {
  const response = await authenticatedClient.post<RefineFeedbackResponse>(
    '/feedback/refine',
    body
  );
  return response.data;
};