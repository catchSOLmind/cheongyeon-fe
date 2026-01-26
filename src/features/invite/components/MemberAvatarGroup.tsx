import type { InvitedMember } from '../types/invite.types';

interface MemberAvatarGroupProps {
  members: InvitedMember[];
}

function MemberAvatarGroup({ members }: MemberAvatarGroupProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2">
        {members.map((member) => (
          member.imageUrl ? (
            <img
              key={member.id}
              src={member.imageUrl}
              alt={member.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div 
              key={member.id}
              className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white" 
            />
          )
        ))}
      </div>
    </div>
  );
}

export default MemberAvatarGroup;