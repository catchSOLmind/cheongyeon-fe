import type { FeedbackPageLoadResponse } from '@/features/todo/types/feedback.types';
import { authenticatedClient } from "@/features/auth/api/client";
import type { WeeklyFeedbackResponse } from '../types/weeklyFeedback.types';


export const getFeedbackTemplate = async (): Promise<FeedbackPageLoadResponse> => {
  const { data } = await authenticatedClient.get<FeedbackPageLoadResponse>(
    '/feedback'
  );
  return data;
};

export const getFeedbackReport = async (): Promise<WeeklyFeedbackResponse> => {
  const { data } = await authenticatedClient.get<WeeklyFeedbackResponse>(
    '/feedback/report'
  );
  return data;
};