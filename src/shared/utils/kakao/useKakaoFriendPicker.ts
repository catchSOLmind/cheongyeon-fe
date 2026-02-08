import { useState, useCallback } from 'react';
import type { KakaoFriend } from '@/shared/utils/kakao/kakao.types'

interface UseKakaoFriendPickerOptions {
  mode?: 'full' | 'popup';
  title?: string;
  maxPickableCount?: number;
  minPickableCount?: number;
  enableSearch?: boolean;
  showMyProfile?: boolean;
  showFavorite?: boolean;
  showPickedFriend?: boolean;
}

export function useKakaoFriendPicker(options?: UseKakaoFriendPickerOptions) {
  const [selectedFriends, setSelectedFriends] = useState<KakaoFriend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.Kakao?.isInitialized()) {
        throw new Error('카카오 SDK가 초기화되지 않았습니다.');
      }

      const friends = await window.Kakao.Picker.selectMultipleFriends({
        mode: options?.mode || 'popup',
        options: {
          title: options?.title || '친구 선택',
          maxPickableCount: options?.maxPickableCount || 10,
          minPickableCount: options?.minPickableCount || 1,
          enableSearch: options?.enableSearch ?? true,
          showMyProfile: options?.showMyProfile ?? true,
          showFavorite: options?.showFavorite ?? true,
          showPickedFriend: options?.showPickedFriend ?? true,
        }
      });

      if (friends && friends.length > 0) {
        setSelectedFriends(friends);
        return friends;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '친구 선택 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('친구 선택 실패:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    selectedFriends,
    isLoading,
    error,
    selectFriends,
  };
}