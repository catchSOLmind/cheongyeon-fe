import { authenticatedClient } from '@/features/auth/api/client';
import type { TestAnswer, TestQuestionsResponse } from '../types/test.types';

export const getTestQuestions = async (): Promise<TestQuestionsResponse> => {
//   console.log('getTestQuestions URL:', '/housework-test/questions');
//   console.log('getTestQuestions config:', JSON.stringify(authenticatedClient.defaults, null, 2));

  const response = await authenticatedClient.get<TestQuestionsResponse>('/housework-test/questions');

//   console.log('getTestQuestions response:', JSON.stringify(response.data, null, 2));

  return response.data;
};

export const submitTestAnswers = async (answers: TestAnswer[]) => {
  const response = await authenticatedClient.post('/housework-test/results', { answers });
  return response.data;
};