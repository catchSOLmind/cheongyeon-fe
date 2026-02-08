
import type { ResultType } from "@/features/test/types/test.types";

export interface ProfileResponse {
  profile: {
    userId: number;
    groupId: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  personalityInfo: {
    hasCompleted: boolean;
    houseworkType: ResultType; // null 포함
    houseworkTypeLabel: string | null;
  };
  summary?: {
    streakDays: number;
    totalPoints: number;
    completedTaskCount: number;
  };
  monthlyActivity?: {
    month: string;
    totalCount: number;
    categories: {
      categoryName: string;
      count: number;
      mySharePercent: number;
    }[];
  };
}

// userstore 용 프로필타입 
export type UserProfile = {
  userId: number;
  groupId: number;
  nickname: string;
  profileImageUrl: string | null ;
  hasCompleted: boolean;
  houseworkType: ResultType;
  houseworkTypeLabel: string | null;
};
