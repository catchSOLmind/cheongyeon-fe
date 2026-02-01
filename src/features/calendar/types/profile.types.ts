// 나의 활동 프로필 조회 응답
export interface ProfileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    profile: {
      nickname: string;
      email: string;
      profileImageUrl: string | null;
      houseworkType: string | null;
      houseworkTypeLabel: string | null;
    };
    summary?: {
      streakDays: number;
      totalPoints: number;
      completedTaskCount: number;
    };
    monthlyActivity?: {
      month: string; // "2026-01"
      totalCount: number;
      categories: {
        categoryName: string;
        count: number;
        mySharePercent: number;
      }[];
    };
  };
}
