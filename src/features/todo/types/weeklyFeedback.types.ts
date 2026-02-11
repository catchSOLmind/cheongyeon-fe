
import type { CategoryType } from '@/features/todo/types/category.types';


// 주간 피드백 전체를 조회 
export interface WeeklyFeedbackResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: WeeklyFeedbackResult;
}

/* =========================
 * Result 루트
 * ========================= */
export interface WeeklyFeedbackResult {
  /** 예: "2026년 1월 1주차" */
  period: string;
  /** 예: "완벽주의 팀플러" */
  groupTitle: string;
  /** 주간 요약 문구 */
  summaries: string[];
  /** 나의 칭찬 스탬프 */
  myPraiseStamp: PraiseStamp[];
  /** 나에게 온 개선 피드백 */
  myImprovements: ImprovementItem[];
  /** 멤버별 최근 피드백 */
  memberFeedbacks: MemberFeedback[];
}

/* =========================
 * 칭찬 스탬프
 * ========================= */
export interface PraiseStamp {
  code: PraiseStampCode;
  title: string;
  description: string;
}

export type PraiseStampCode =
  | 'DETAIL_KING'
  | 'SPEED_MASTER'
  | 'CONSISTENT_WORKER'
  | 'TEAM_PLAYER'
  | string;

/* =========================
 * 개선 피드백
 * ========================= */
export interface ImprovementItem {
  category: CategoryType;
  content: string;
  authorName: string;
  profileImageUrl: string | null;
}

/* =========================
 * 멤버 피드백 요약
 * ========================= */
export interface MemberFeedback {
  memberId: number;
  nickname: string;
  latestFeedbackContent: string;
}
