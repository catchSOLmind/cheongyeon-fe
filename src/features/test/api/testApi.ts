import { authenticatedClient } from '@/features/auth/api/client';
import type { TestAnswer, TestQuestionsResponse } from '../types/test.types';

export const getTestQuestions = async (): Promise<TestQuestionsResponse> => {
  const response = await authenticatedClient.get<TestQuestionsResponse>('/housework-test/questions');
  return response.data;
};

export const submitTestAnswers = async (answers: TestAnswer[]) => {
  const response = await authenticatedClient.post('/housework-test/results', { answers });
  return response.data;
};