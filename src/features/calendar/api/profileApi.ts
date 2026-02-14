// profile.api.ts
import { authenticatedClient } from "@/features/auth/api/client";
import type { ProfileResponse } from "../types/profile.types";

//프로필 조회하기
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await authenticatedClient.get<ProfileResponse>("/profile");
  return response.data;
};