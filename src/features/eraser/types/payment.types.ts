
// 사용자의 포인트를 조회한다 
// GET /api/eraser/payment-info
export interface UserPointResult {
  currentPoint: number;
  maxUsablePoint: number;
}

export interface UserPointResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: UserPointResult;
}


// 사용자의 예약을 확정한다 
// POST /api/eraser/reservation
export interface ReservationConfirmItem {
  suggestionTaskId: number;
  optionId: number;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm
}

export interface ReservationConfirmRequest {
  usedPoint: number;
  reservations: ReservationConfirmItem[];
}

export interface ReservationConfirmResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: number;
}

