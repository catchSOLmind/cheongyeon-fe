import { useState } from "react";
import Header from "@/shared/components/Header";
import MemberAvatarGroup from "../components/MemberAvatarGroup";
import MemberList from "../components/MemberList";
import InviteModal from "../components/inviteModal";
import { useInvitedMembers } from "../hooks/useInvitedMembers";

function InvitePage() {
  const houseId = '123';
  const { members, isLoading, error } = useInvitedMembers(houseId);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };

  const handleKakaoInvite = () => {
    console.log('카카오톡 초대');
    // TODO: 카카오톡 초대 로직
  };

  const handleCopyLink = () => {
    console.log('링크 복사');
    // TODO: 링크 복사 로직
  };


  return (
    <div>
      <Header title="멤버 초대" showBackButton />

      <div className="px-5 pb-[140px]">
        {/* 프로필 이미지들 */}
        <div className="mt-7">
          <MemberAvatarGroup members={members} />
        </div>

        {/* 타이틀 */}
        <h1 className="mt-8 text-body-l-bold text-black">
          초대된 우리 멤버
        </h1>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="mt-4 text-center py-8 text-gray-500">
            로딩 중...
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="mt-4 text-center py-8 text-red-500">
            멤버를 불러오는데 실패했습니다.
          </div>
        )}

        {/* 멤버 리스트 */}
        {!isLoading && !error && <MemberList members={members} />}
      </div>

      {/* 초대하기 */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <p className="text-center text-label-l text-gray-600 mb-7">
          최대 5명까지 초대 가능합니다
        </p>
        
        <button
          onClick={handleInviteClick}
          className="w-full py-4 rounded-lg bg-[#424B4C] text-white font-cta-m">
          멤버 초대하기
        </button>
      </div>

      {/* 초대 팝업 */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
        onKakaoInvite={handleKakaoInvite}
        onCopyLink={handleCopyLink}
      />
    </div>
  );
}

export default InvitePage;