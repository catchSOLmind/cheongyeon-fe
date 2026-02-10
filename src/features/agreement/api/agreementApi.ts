// src/features/agreement/api/agreementApi.ts

import { authenticatedClient } from '@/features/auth/api/client';
import type {
  CreateAgreementRequest,
  CreateAgreementResponse,
} from '@/features/agreement/types/ageement.types';
import type { GetAgreementResponse } from '../types/agreementDetail.types';
import type { AgreementConfirmResult } from '@/features/agreement/types/agreementSign.types';
import type { ApiResponse } from '@/shared/types/ApiResponse';
import type { AgreementSignResponse } from '../types/agreementSign.types';


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

//협약서 확정하기

/**
 * 협약서 확정
 * - OWNER만 가능
 * - 모든 멤버가 AGREE 상태여야 함
 */
export const confirmAgreement = async (
  agreementId: number
): Promise<ApiResponse<AgreementConfirmResult>> => {
  const response = await authenticatedClient.post<
    ApiResponse<AgreementConfirmResult>
  >(`/agreements/${agreementId}/confirm`);

  return response.data;
};


// 협약서에 서명합니다
// POST /api/agreements/{agreementId}/sign
export const signAgreement = async (
  agreementId: number
): Promise<AgreementSignResponse> => {
  const response = await authenticatedClient.post<AgreementSignResponse>(
    `/api/agreements/${agreementId}/sign`
  );
  return response.data;
};

