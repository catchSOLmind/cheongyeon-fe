
export type AgreementStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED';

/** 협약서 확정 결과 */
export interface AgreementConfirmResult {
  agreementId: number;
  status: AgreementStatus;
  confirmedAt: string; // ISO datetime
  houseName: string;
}