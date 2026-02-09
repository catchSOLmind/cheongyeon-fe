// src/features/eraser/api/eraserPaymentApi.ts
import { authenticatedClient } from '@/features/auth/api/client';
import type {
  UserPointResponse,
  ReservationConfirmRequest,
  ReservationConfirmResponse,
} from '@/features/eraser/types/payment.types';

// 사용자의 포인트를 조회한다
// GET /api/eraser/payment-info
export const getEraserPaymentInfo = async (): Promise<UserPointResponse> => {
  const response = await authenticatedClient.get<UserPointResponse>(
    '/eraser/payment-info'
  );
  return response.data;
};

// 사용자의 예약을 확정한다
// POST /api/eraser/reservation
export const postEraserReservation = async (
  payload: ReservationConfirmRequest
): Promise<ReservationConfirmResponse> => {
  const response = await authenticatedClient.post<ReservationConfirmResponse>(
    '/eraser/reservation',
    payload
  );
  return response.data;
};
