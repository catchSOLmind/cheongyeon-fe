/** 공통 API 래퍼 (프로젝트에 이미 있으면 그걸 import해서 써도 됨) */
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type GroupRole = 'OWNER' | 'MEMBER'; // Swagger 예시에 OWNER만 보이는데 보통 MEMBER도 있음(서버 스펙 맞춰 조정)
export type GroupJoinStatus = 'JOINED'; // Swagger 예시 기준

export type AcceptInvitationResult = {
  groupId: number;
  memberId: number;
  role: GroupRole;
  status: GroupJoinStatus;
  joinedAt: string; // ISO datetime string
};

export type AcceptInvitationResponse = ApiResponse<AcceptInvitationResult>;
