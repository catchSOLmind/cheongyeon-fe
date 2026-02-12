



// 게스트 로그인 

export interface GuestAuthResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    nickname: string;
    groupId: number;
    groupName: string;
    memberStatus: string;
  };
}
