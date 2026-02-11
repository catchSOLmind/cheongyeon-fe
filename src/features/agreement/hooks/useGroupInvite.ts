import { useState, useCallback } from 'react';
import { createInvitation } from '../api/makeGroupApi';

export function useGroupInvite() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAndShare = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { inviteUrl } = await createInvitation();

      if (window.Kakao?.isInitialized()) {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: '하우스 멤버 초대',
            description: '협약서를 함께 작성해요!',
            imageUrl: '썸네일_이미지_URL',
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
      } else {
        await navigator.clipboard.writeText(inviteUrl);
        alert('초대 링크가 복사되었습니다.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '초대 실패';
      setError(errorMessage);
      console.error('초대 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createAndShare, isLoading, error };
}