import { useState, useCallback } from 'react';
import { createInvitation } from '../api/makeGroupApi';

interface KakaoShareOptions {
  title: string;
  description: string;
  imageUrl: string;
}

export function useGroupInvite() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAndShare = useCallback(async (shareOptions: KakaoShareOptions) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1) ✅ invitationId 받기 (number)
      const invitationId = await createInvitation();

      // 2) ✅ CloudFront 기반 inviteUrl 생성
      const baseUrl = (import.meta.env.VITE_APP_BASE_URL || '').replace(/\/$/, '');
      if (!baseUrl) throw new Error('VITE_APP_BASE_URL이 설정되지 않았습니다.');

      const inviteUrl = `${baseUrl}/invite/${invitationId}`;

      // 3) 카카오 SDK 체크
      const kakao = window.Kakao;
      if (!kakao) throw new Error('window.Kakao를 찾을 수 없습니다. SDK 로드 확인 필요');
      if (!kakao.isInitialized()) throw new Error('카카오 SDK가 초기화되지 않았습니다.');

      // 4) 공유
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareOptions.title,
          description: shareOptions.description,
          imageUrl: shareOptions.imageUrl,
          link: {
            mobileWebUrl: inviteUrl,
            webUrl: inviteUrl,
          },
        },
        buttons: [
          {
            title: '초대 수락하기',
            link: {
              mobileWebUrl: inviteUrl,
              webUrl: inviteUrl,
            },
          },
        ],
      });

      return inviteUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '초대 링크 생성 및 공유 실패';
      setError(errorMessage);
      console.error('초대 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createAndShare, isLoading, error };
}
