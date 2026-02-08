// src/features/feedback/types/feedback.types.ts

import type { CategoryType } from '@/features/todo/types/category.types';
import type { ResultType } from '@/features/test/types/test.types';

/** 공통 API 래퍼 */
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

/** 칭찬 스탬프 코드 */
export type PraiseTypeCode =
  | 'DETAIL_KING'
  | 'TIME_KEEPER'
  | 'DUST_KILLER'
  | 'SCENT_KING'
  | 'POINT_KING'
  | 'ORGANIZING_KING';

/** 그룹 멤버 */
export type GroupMember = {
  groupMemberId: number;
  nickname: string;
  profileImageUrl: string | null;
  /** 성향테스트 결과가 없을 경우 null */
  testResultType: ResultType | null;
};

/** 칭찬 스탬프 */
export type PraiseType = {
  code: PraiseTypeCode;
  title: string;        // 예: "꼼꼼왕"
  description: string;  // 예: "꼼꼼하게 잘 해요"
};

/** 피드백 작성 페이지 로드 result */
export type FeedbackPageLoadResult = {
  groupMembers: GroupMember[];
  praiseTypes: PraiseType[];
  taskCategories: CategoryType[]; // ["BATHROOM"]
};

/**
 * 피드백 작성 페이지 로드 응답
 * - 서버가 "성향테스트 결과가 없을 경우 NULL"을 어디에 두는지 애매할 수 있어서:
 *   1) result 자체가 null
 *   2) groupMembers[].testResultType 이 null
 * 둘 다 대응
 */
export type FeedbackPageLoadResponse = ApiResponse<FeedbackPageLoadResult | null>;
