// src/features/agreement/types/agreementDetail.types.ts

/* ==============================
 * Agreement Status
 * ============================== */
export type AgreementStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED';

/* ==============================
 * Member Role / Sign Status
 * ============================== */
export type AgreementMemberRole = 'OWNER' | 'MEMBER';

export type AgreementSignStatus = 'PENDING' | 'AGREED';

/* ==============================
 * Agreement Rule Item
 * ============================== */
export interface AgreementRuleItem {
  itemId: number;
  itemOrder: number;
  itemText: string;
}

/* ==============================
 * Agreement Member
 * ============================== */
export interface AgreementMember {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  role: AgreementMemberRole;
  signStatus: AgreementSignStatus;
  signedAt: string | null; // 서명 전이면 null
}

/* ==============================
 * Agreement Detail
 * ============================== */
export interface AgreementDetail {
  agreementId: number;
  status: AgreementStatus;

  deadline: string; // yyyy-mm-dd or ISO
  houseName: string;
  monthlyGoal: string;

  rules: AgreementRuleItem[];
  members: AgreementMember[];

  confirmedAt: string | null;
  updatedAt: string;
}

/* ==============================
 * Common API Response Wrapper
 * ============================== */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/* ==============================
 * Get Agreement Response
 * ============================== */
export type GetAgreementResponse = ApiResponse<AgreementDetail>;
