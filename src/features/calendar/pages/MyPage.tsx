import { useEffect, useState } from 'react';
import Header from '@/shared/components/Header';
import { getProfile } from '../api/profileApi';
import type { ProfileResponse } from '../types/profile.types';
import DefaultProfile from '@/assets/common/img-default-profile.svg'

// 카테고리별 색상 매핑
const categoryColors = [
  'bg-cyan-300',
  'bg-pink-300',
  'bg-gray-400',
  'bg-yellow-300',
  'bg-green-300',
  'bg-blue-300',
  'bg-purple-300',
  'bg-orange-300',
];

// 기본 프로필 데이터
const defaultProfileData: ProfileResponse['result'] = {
  profile: {
    nickname: '',
    email: '',
    profileImageUrl: null,
    houseworkType: null,
    houseworkTypeLabel: null,
  },
  summary: {
    streakDays: 0,
    totalPoints: 0,
    completedTaskCount: 0,
  },
  monthlyActivity: {
    month: new Date().toISOString().slice(0, 7), // 현재 월 (YYYY-MM)
    totalCount: 0,
    categories: [],
  },
};

function MyPage() {
  const [profileData, setProfileData] = useState<ProfileResponse['result']>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getProfile() as ProfileResponse | { profile: ProfileResponse['result']['profile'] };
        
        // 응답 구조에 따라 처리
        if ('isSuccess' in response && response.isSuccess && response.result) {
          // 정상 응답: { isSuccess: true, result: { profile: {...}, summary: {...}, ... } }
          setProfileData({
            profile: response.result.profile,
            summary: response.result.summary || defaultProfileData.summary,
            monthlyActivity: response.result.monthlyActivity || defaultProfileData.monthlyActivity,
          });
        } else if ('profile' in response && !('isSuccess' in response)) {
          // 직접 profile 객체가 오는 경우: { profile: {...} }
          setProfileData({
            profile: response.profile,
            summary: defaultProfileData.summary,
            monthlyActivity: defaultProfileData.monthlyActivity,
          });
        } else {
          // 응답이 없거나 실패한 경우 기본값 사용
          setProfileData(defaultProfileData);
        }
      } catch (error) {
        console.error('프로필 데이터 조회 실패:', error);
        // 에러 발생 시 기본값 사용
        setProfileData(defaultProfileData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pb-4">
        <Header title="나의 활동" showBackButton />
        <div className="flex items-center justify-center py-12">
          <p className="text-body-m text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // summary 기본값 (없으면 0으로 표시)
  const summary = profileData.summary || {
    streakDays: 0,
    totalPoints: 0,
    completedTaskCount: 0,
  };

  // 월별 활동 데이터에 색상 추가
  const monthlyActivities = profileData.monthlyActivity?.categories.map((category, index) => ({
    ...category,
    color: categoryColors[index % categoryColors.length],
  })) || [];


  return (
    <div className="bg-white min-h-screen pb-4">
    <Header title="나의 활동" showBackButton />
      {/* 프로필 섹션 */}
      <div className="flex flex-col items-center pt-8 pb-6">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-4">
          {profileData.profile.profileImageUrl ? (
            <img
              src={profileData.profile.profileImageUrl || DefaultProfile}
              alt={profileData.profile.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* 사용자 이름 */}
        <h1 className="text-body-l-bold text-black mb-1">{profileData.profile.nickname}</h1>

        {/* 이메일 */}
        <p className="text-body-s text-gray-600 mb-3">{profileData.profile.email}</p>

        {/* 가사 성향 태그 */}
        {profileData.profile.houseworkTypeLabel && (
          <div className="px-4 py-1.5 bg-gray-100 rounded-full">
            <span className="text-body-s text-gray-700">
              나의 가사 성향 • {profileData.profile.houseworkTypeLabel}
            </span>
          </div>
        )}
      </div>

      {/* 성과 지표 섹션 */}
      <div className="flex justify-center gap-4 px-5 mb-6">
        {/* 연속 달성 */}
        <div className="flex-1 max-w-[100px] flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-body-l-bold text-black mb-0.5">
            {summary.streakDays}일
          </p>
          <p className="text-body-s text-gray-600">연속 달성</p>
        </div>

        {/* 청소 포인트 */}
        <div className="flex-1 max-w-[100px] flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-body-l-bold text-black mb-0.5">
            {summary.totalPoints.toLocaleString()}
          </p>
          <p className="text-body-s text-gray-600">청소 포인트</p>
        </div>

        {/* 완료한 할 일 */}
        <div className="flex-1 max-w-[100px] flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-body-l-bold text-black mb-0.5">
            {summary.completedTaskCount}개
          </p>
          <p className="text-body-s text-gray-600">완료한 할 일</p>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-gray-200 mx-5 mb-6" />

      {/* 이번 달 활동 섹션 */}
      <div className="px-5">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-body-m text-black">이번 달 활동</h2>
          <span className="text-body-m text-gray-400">›</span>
        </div>

        {/* 진행 바 */}
        {monthlyActivities.length > 0 ? (
          <>
            <div className="flex h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
              {monthlyActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`${activity.color} h-full`}
                  style={{ width: `${activity.mySharePercent}%` }}
                />
              ))}
            </div>

            {/* 활동 상세 리스트 */}
            <div className="space-y-3">
              {monthlyActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  {/* 색상 스와치 */}
                  <div className={`w-4 h-4 ${activity.color} rounded mt-0.5 shrink-0`} />

                  {/* 텍스트 정보 */}
                  <div className="flex-1">
                    <p className="text-body-m text-black">
                      {activity.categoryName} {activity.count}번
                    </p>
                    <p className="text-body-s text-gray-600 mt-0.5">
                      내가 맡은 일의 {activity.mySharePercent}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-body-m text-gray-400">활동 내역이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
