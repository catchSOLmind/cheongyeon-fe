export interface KakaoPickerOptions {
  title?: string;
  viewAppearance?: 'auto' | 'light' | 'dark';
  orientation?: 'auto' | 'landscape' | 'portrait';
  enableSearch?: boolean;
  showMyProfile?: boolean;
  showFavorite?: boolean;
  showPickedFriend?: boolean;
  maxPickableCount?: number;
  minPickableCount?: number;
}

export interface KakaoFriend {
  uuid: string;
  id?: number;
  favorite?: boolean;
  profileNickname?: string;
  profileThumbnailImage?: string;
}

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Picker: {
        selectSingleFriend: (params: {
          mode: 'full' | 'popup';
          options?: KakaoPickerOptions;
        }) => Promise<KakaoFriend | undefined>;
        selectMultipleFriends: (params: {
          mode: 'full' | 'popup';
          options?: KakaoPickerOptions;
        }) => Promise<KakaoFriend[] | undefined>;
      };
      Share: {
        sendDefault(arg0: { objectType: string; content: { title: string; description: string; imageUrl: string; link: { mobileWebUrl: string; webUrl: string; }; }; buttons: { title: string; link: { mobileWebUrl: string; webUrl: string; }; }[]; }): unknown;
        sendScrap: (options: {
          requestUrl: string;
          templateId: number;
          templateArgs?: Record<string, string>;
        }) => void;
      };
    };
  }
}