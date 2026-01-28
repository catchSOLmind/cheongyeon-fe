import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not set');
}

// 인증이 필요 없는 공개 API 요청용 axios 인스턴스
export const publicClient = axios.create({
  baseURL,
});
