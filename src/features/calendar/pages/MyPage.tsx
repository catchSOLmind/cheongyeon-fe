import { useEffect } from 'react';
import Header from '@/shared/components/Header';
import { useUserStore } from '@/features/auth/stores/useUserStore';

function MyPage() {
  const { user, houseworkTypeLabel, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // TODO: API 연결 후 실제 데이터로 변경
  const mockData = {
    profileImage: user?.profileImg || '', // 프로필 이미지 URL
    userName: user?.nickname || '',
    email: user?.email || '',
    routineType: houseworkTypeLabel || '루틴형', // 가사 성향
    consecutiveDays: 3, // 연속 달성 일수
    cleaningPoints: 12500, // 청소 포인트
    completedTasks: 47, // 완료한 할 일 개수
    monthlyActivities: [
      {
        category: '주방 청소',
        count: 6,
        percentage: 50,
        color: 'bg-cyan-300', // light blue/cyan
      },
      {
        category: '화장실 청소',
        count: 4,
        percentage: 20,
        color: 'bg-pink-300', // light pink/salmon
      },
      {
        category: '기타 업무',
        count: 2,
        percentage: 30,
        color: 'bg-gray-400', // medium gray
      },
    ],
  };


  return (
    <div className="bg-white min-h-screen pb-4">
    <Header title="나의 활동" showBackButton />
      {/* 프로필 섹션 */}
      <div className="flex flex-col items-center pt-8 pb-6">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-4">
          {mockData.profileImage ? (
            <img
              src={mockData.profileImage}
              alt={mockData.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* 사용자 이름 */}
        <h1 className="text-body-l-bold text-black mb-1">{mockData.userName}</h1>

        {/* 이메일 */}
        <p className="text-body-s text-gray-600 mb-3">{mockData.email}</p>

        {/* 가사 성향 태그 */}
        <div className="px-4 py-1.5 bg-gray-100 rounded-full">
          <span className="text-body-s text-gray-700">
            나의 가사 성향 • {mockData.routineType}
          </span>
        </div>
      </div>

      {/* 성과 지표 섹션 */}
      <div className="flex justify-center gap-4 px-5 mb-6">
        {/* 연속 달성 */}
        <div className="flex-1 max-w-[100px] flex flex-col items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-body-l-bold text-black mb-0.5">
            {mockData.consecutiveDays}일
          </p>
          <p className="text-body-s text-gray-600">연속 달성</p>
        </div>

        {/* 청소 포인트 */}
        <div className="flex-1 max-w-[100px] flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-body-l-bold text-black mb-0.5">
            {mockData.cleaningPoints.toLocaleString()}
          </p>
          <p className="text-body-s text-gray-600">청소 포인트</p>
        </div>

        {/* 완료한 할 일 */}
        <div className="flex-1 max-w-[100px] flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-body-l-bold text-black mb-0.5">
            {mockData.completedTasks}개
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
        <div className="flex h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
          {mockData.monthlyActivities.map((activity, index) => (
            <div
              key={index}
              className={`${activity.color} h-full`}
              style={{ width: `${activity.percentage}%` }}
            />
          ))}
        </div>

        {/* 활동 상세 리스트 */}
        <div className="space-y-3">
          {mockData.monthlyActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* 색상 스와치 */}
              <div className={`w-4 h-4 ${activity.color} rounded mt-0.5 shrink-0`} />

              {/* 텍스트 정보 */}
              <div className="flex-1">
                <p className="text-body-m text-black">
                  {activity.category} {activity.count}번
                </p>
                <p className="text-body-s text-gray-600 mt-0.5">
                  내가 맡은 일의 {activity.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
