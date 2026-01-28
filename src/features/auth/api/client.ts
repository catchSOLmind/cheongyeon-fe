import axios from 'axios';
import { setupInterceptors } from './interceptors';

// 인증이 필요한 API 요청용 axios 인스턴스 생성 및 인터셉터 설정
export const authenticatedClient = setupInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  })
);
