// profile.api.ts
import { authenticatedClient } from "@/features/auth/api/client";
import type { ProfileResponse } from "../types/profile.types";

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await authenticatedClient.get<ProfileResponse>("/profile");
  return res.data;
};