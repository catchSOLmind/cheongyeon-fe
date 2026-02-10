import { useState, useCallback } from 'react';
import { createInvitationLink } from '../api/makeGroupApi';

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

      // 1) 초대 링크 생성 
      const inviteUrl = await createInvitationLink();
      if (!inviteUrl) throw new Error('초대 링크가 비어있습니다.');

      // console.log('생성된 초대 링크:', inviteUrl);

      // 2) 카카오 SDK 체크
      const kakao = window.Kakao;
      if (!kakao) throw new Error('window.Kakao를 찾을 수 없습니다. SDK 로드 확인 필요');
      if (!kakao.isInitialized()) throw new Error('카카오 SDK가 초기화되지 않았습니다.');

      // 3) 공유
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
