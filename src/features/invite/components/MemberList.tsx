import type { InvitedMember } from '../types/invite.types';

interface MemberListProps {
  members: InvitedMember[];
}

function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="mt-4 text-center py-8 text-gray-500">
        초대된 멤버가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4">
      {members.map((member) => (
        <div key={member.id} className="h-[68px] flex items-center">
          <div className="flex items-center gap-3 w-full">
            {member.imageUrl ? (
              <img 
                src={member.imageUrl} 
                alt={member.name}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
            ) : (
                // 기본 프로필 이미지 
              <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-[5px]">
                <p className="text-body-m-bold text-black">
                  {member.name}
                </p>

                {member.tag && (
                <span className="inline-flex items-center justify-center w-[25px] h-[13.75px] text-[8.64px] leading-[14px] font-regular rounded-[2.88px] bg-primary text-white">
                    {member.tag}
                  </span>
                )}
              </div>

              {member.subtitle && (
                <p className="mt-0.5 text-body-s text-gray-600">
                  {member.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white" />
        </div>
      ))}
    </div>
  );
}

export default MemberList;