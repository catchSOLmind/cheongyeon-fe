// src/features/agreement/api/agreementApi.ts

import { authenticatedClient } from '@/features/auth/api/client';
import type {
  CreateAgreementRequest,
  CreateAgreementResponse,
} from '@/features/agreement/types/ageeement.types';


//협약서 초안 작성하기
export const createAgreement = async (
  body: CreateAgreementRequest
): Promise<CreateAgreementResponse> => {
  const response = await authenticatedClient.post<CreateAgreementResponse>(
    '/agreements',
    body
  );

  return response.data;
};
