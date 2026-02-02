import type { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import { getAccessToken, refreshAccessToken, clearTokens } from '../utils/token';

// ===== 토큰 갱신 관련 상태 관리 =====
// 현재 토큰 갱신이 진행 중인지 여부 (중복 갱신 방지)
let isRefreshing = false;

// 토큰 갱신을 기다리고 있는 요청들의 대기열
// 각 요청의 resolve/reject 함수를 저장해서 나중에 처리
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

// 토큰 갱신 완료 후 대기열 처리
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // 에러가 있으면 모든 요청 실패 처리
    } else {
      prom.resolve(token); // 토큰이 있으면 모든 요청에 토큰 전달
    }
  });
  failedQueue = []; // 처리 완료 후 대기열 비우기
};

// 로그인/리프레시 요청 경로 (interceptor 루프에서 제외)
const AUTH_EXCLUDED_PATHS = [
  '/oauth/kakao/login',
  '/oauth/kakao/refresh',
];

// 요청이 인증 제외 경로인지 확인
const isAuthExcludedPath = (url: string | undefined): boolean => {
  if (!url) return false;
  return AUTH_EXCLUDED_PATHS.some((path) => url.includes(path));
};

// ===== 요청 인터셉터 설정 =====
// 모든 API 요청이 나가기 전에 실행됨
// localStorage에서 토큰을 가져와서 Authorization 헤더에 자동으로 추가
// 단, 로그인/리프레시 요청은 제외 (무한 루프 방지)
const setupRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      // 로그인/리프레시 요청은 Authorization 헤더를 붙이지 않음
      if (isAuthExcludedPath(config.url)) {
        return config;
      }
      
      const token = getAccessToken(); // localStorage에서 토큰 가져오기
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 헤더에 토큰 추가
      }
      return config; // 수정된 설정으로 요청 진행
    },
    (error) => {
      return Promise.reject(error); // 에러 발생 시 그대로 전달
    }
  );
};

// ===== 응답 인터셉터 설정 =====
// 모든 API 응답을 받은 후 실행됨
// 401 에러(토큰 만료)가 발생하면 자동으로 토큰 갱신 후 재시도
const setupResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 통과
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 로그인/리프레시 요청은 401 처리에서 제외 (무한 루프 방지)
      if (isAuthExcludedPath(originalRequest.url)) {
        return Promise.reject(error);
      }

      // 401 에러(인증 실패)이고, 아직 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        // 재시도 플래그를 먼저 설정 (무한 루프 방지)
        // 대기열 요청과 갱신 시작 요청 모두에 적용
        originalRequest._retry = true;
        
        // 케이스 1: 이미 다른 요청이 토큰 갱신 중인 경우
        if (isRefreshing) {
          // 이 요청을 대기열에 추가하고, 갱신 완료되면 처리
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject }); // 대기열에 추가
          })
            .then((token) => {
              // 갱신 완료! 새 토큰으로 원래 요청 재시도
              // _retry 플래그가 이미 설정되어 있어서 재시도 시 무한 루프 방지
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // 케이스 2: 첫 번째로 401 에러를 받은 요청 → 토큰 갱신 시작
        isRefreshing = true; // 갱신 시작 표시

        try {
          // 리프레시 토큰으로 새 액세스 토큰 받아오기
          const newAccessToken = await refreshAccessToken();
          
          if (newAccessToken) {
            // 토큰 갱신 성공
            // 대기 중이던 다른 요청들도 모두 새 토큰으로 처리
            processQueue(null, newAccessToken);
            
            // 원래 실패했던 요청을 새 토큰으로 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            isRefreshing = false; // 갱신 완료
            return instance(originalRequest); // 재시도
            
          } else {
            // 리프레시 토큰도 만료됨 → 로그인 필요
            processQueue(error); // 대기 중인 요청들 모두 실패 처리
            clearTokens(); // 저장된 토큰 모두 삭제
            
            // useUserStore 클리어
            import('../stores/useUserStore').then(({ useUserStore }) => {
              useUserStore.getState().clearProfile();
            }).catch(() => {
              // store가 없거나 import 실패해도 무시
            });
            
            isRefreshing = false;
            window.location.href = '/login'; // 로그인 페이지로 이동
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // 토큰 갱신 중 에러 발생
          processQueue(refreshError as AxiosError); // 대기 중인 요청들 모두 실패 처리
          clearTokens();
          
          // useUserStore 클리어
          import('../stores/useUserStore').then(({ useUserStore }) => {
            useUserStore.getState().clearProfile();
          }).catch(() => {
            // store가 없거나 import 실패해도 무시
          });
          
          isRefreshing = false;
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // 401이 아니거나 이미 재시도한 요청은 그대로 에러 반환
      return Promise.reject(error);
    }
  );
};

// ===== 인터셉터 통합 설정 함수 =====
// axios 인스턴스에 요청/응답 인터셉터를 모두 설정
export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
  return instance; // 체이닝을 위해 인스턴스 반환
};
