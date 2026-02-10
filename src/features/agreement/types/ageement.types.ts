export type AgreementStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED';

/**
 * 협약서 생성 요청
 * - 그룹 OWNER만 가능
 * - 그룹 멤버 수 2~5명
 * - rules: 1~5개
 */
export interface CreateAgreementRequest {
  deadline: string; // 협약 체결일 = 멤버가 모두 동의한 날

  /** 우리집 이름 */
  houseName: string;

  /** 한 달 목표 */
  monthlyGoal: string;

  /** 우리집 규칙 */
  rules: string[];
}

/* ==============================
 * Response - Rule Item
 * ============================== */

export interface AgreementRuleItem {
  itemId: number;
  itemOrder: number;
  itemText: string;
}


export interface Agreement {
  agreementId: number;
  status: AgreementStatus;
  deadline: string;
  houseName: string;
  monthlyGoal: string;
  rules: AgreementRuleItem[];
  createdAt: string;
}


export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}


export type CreateAgreementResponse = ApiResponse<Agreement>;
