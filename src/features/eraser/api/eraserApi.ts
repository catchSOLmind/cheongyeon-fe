import { authenticatedClient } from "@/features/auth/api/client";
import type { GetEraserRecommendationsResponse } from "../types/eraser.types";
import type { EraserOptionsResponse, GetEraserOptionsParams } from "../types/eraserOptions.types";

//청연 지우개 추천 업무 조회
export const getEraserRecommendations = async (): Promise<GetEraserRecommendationsResponse> => {
  const response =
    await authenticatedClient.get<GetEraserRecommendationsResponse>(
      '/eraser/recommendations'
    );

  return response.data;
};

// 선택한 추천 업무들의 옵션 목록 조회
export const getEraserOptions = async (
  params: GetEraserOptionsParams
): Promise<EraserOptionsResponse> => {
  const response = await authenticatedClient.get<EraserOptionsResponse>(
    "/eraser/options",
    {
      params: { suggestionTaskId: params.suggestionTaskId },
      paramsSerializer: {
        indexes: null,
      },
    }
  );
  return response.data;
};