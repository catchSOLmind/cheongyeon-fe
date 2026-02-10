
/* =========================
 * Enum / Union Types
 * ========================= */

export type GroupMemberRole = 'OWNER' | 'MEMBER';

export type GroupMemberStatus =
  | 'JOINED'
  | 'LEFT'
  | 'PENDING';

/* =========================
 * Domain Types
 * ========================= */

export interface GroupMember {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  role: GroupMemberRole;
  status: GroupMemberStatus;
  joinedAt: string; // ISO 8601
}

/* =========================
 * API Result Types
 * ========================= */

export interface GroupMemberListResult {
  groupId: number;
  memberCount: number;
  members: GroupMember[];
}

/* =========================
 * Common API Response
 * ========================= */

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/* =========================
 * API Response Type
 * ========================= */

export type GetGroupMembersResponse =
  ApiResponse<GroupMemberListResult>;
