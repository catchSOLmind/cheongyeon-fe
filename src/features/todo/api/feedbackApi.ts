import type { FeedbackPageLoadResponse } from '@/features/todo/types/feedback.types';
import { authenticatedClient } from "@/features/auth/api/client";


export const getFeedbackTemplate = async (): Promise<FeedbackPageLoadResponse> => {
  const { data } = await authenticatedClient.get<FeedbackPageLoadResponse>(
    '/feedback'
  );
  return data;
};