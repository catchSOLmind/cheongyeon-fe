import { authenticatedClient } from "@/features/auth/api/client";
import type { GetEraserRecommendationsResponse } from "../types/eraser.types";

// GET api/eraser/recommendations
/** 청연 지우개 추천 업무 조회 */
export const getEraserRecommendations = async (): Promise<GetEraserRecommendationsResponse> => {
  const response =
    await authenticatedClient.get<GetEraserRecommendationsResponse>(
      '/eraser/recommendations'
    );

  return response.data;
};