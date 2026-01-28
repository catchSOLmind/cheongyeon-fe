import axios from "axios";

// 인증이 필요 없는 공개 API 요청용 axios 인스턴스
export const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});
