// src/features/calendar/types/dashboard.types.ts

export type GroupDashboardResult = {
  thisMonthStreakDays: number;

  thisWeekCleaningKing: {
    memberId: number;
    nickname: string;
    profileImageUrl: string;
    completedCount: number;
  } | null;

  houseworkCompletionRate: number;

  postponeTop3: Array<{
    rank: number;
    memberId: number;
    nickname: string;
    profileImageUrl: string;
    postponeCount: number;
  }>;
};

export type GetGroupDashboardResponse = GroupDashboardResult;
