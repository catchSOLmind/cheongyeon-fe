import { authenticatedClient } from '@/features/auth/api/client';
import type { ProfileResponse } from '../types/profile.types';

// 나의 활동 프로필 조회
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await authenticatedClient.get<ProfileResponse>('/profile');
  return response.data;
};
