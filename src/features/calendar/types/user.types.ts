// 전역적으로 저장할 유저 프로필
export type UserProfile = {
    userId: number;
    nickname: string;
    email: string;
    profileImageUrl: string | null;
    houseworkTypeLabel: string | null;
  };