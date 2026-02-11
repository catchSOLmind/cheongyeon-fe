
export type AgreementStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED';

/** 협약서 확정 결과 */
export interface AgreementConfirmResult {
  agreementId: number;
  status: AgreementStatus;
  confirmedAt: string; // ISO datetime
  houseName: string;
}

// 멤버가 협약서에 동의한다 

export type AgreementSignStatus = 'PENDING' | 'SIGNED';

export interface AgreementSignResult {
  agreementId: number;
  memberId: number;
  signStatus: AgreementSignStatus;
  signedAt: string | null; // ISO string
  allSigned: boolean;
  signedCount: number;
  totalCount: number;
}

export interface AgreementSignResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AgreementSignResult;
}
