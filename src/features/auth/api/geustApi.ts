import type { GuestAuthResponse } from "../types/guestAuth.types";
import { publicClient } from "./publicClient";


export const guestLogin = async (): Promise<GuestAuthResponse> => {
  const { data } = await publicClient.post<GuestAuthResponse>(
    '/auth/guest'
  );

  return data;
};
