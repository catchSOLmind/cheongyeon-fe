// src/features/agreement/api/agreementApi.ts

import { authenticatedClient } from '@/features/auth/api/client';
import type {
  CreateAgreementRequest,
  CreateAgreementResponse,
} from '@/features/agreement/types/ageement.types';
import type { GetAgreementResponse } from '../types/agreementDetail.types';


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

// 협약서 내용 조회하기
export const getAgreement = async (): Promise<GetAgreementResponse> => {
  const response = await authenticatedClient.get<GetAgreementResponse>(
    '/agreements'
  );
  return response.data;
};
