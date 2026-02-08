// src/features/calendar/constants/postponeReason.ts
import type { PostponeReasonCode } from '../types/myTaskEdit.types';

export const POSTPONE_REASON_LABEL: Record<PostponeReasonCode, string> = {
  NO_TIME: '시간이 부족해요',
  ANOTHER_SCHEDULE: '다른 일정이 생겼어요',
  SICK: '몸이 안 좋아요',
  NO_TOOL: '청소 도구가 없어요',
  FORGOT: '깜빡했어요',
  NO_HOME: '집에 없어요',
  ETC: '기타',
};

export const POSTPONE_REASON_LIST: PostponeReasonCode[] = [
  'NO_TIME',
  'ANOTHER_SCHEDULE',
  'SICK',
  'NO_TOOL',
  'FORGOT',
  'NO_HOME',
  'ETC',
];
