// 그룹 멤버를 조회하고 선택할 수 있는 바텀 시트

import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import type { GroupMember } from '@/shared/group/groupMembers.types';

interface AssigneeBottomSheetProps {
  open: boolean;
  onClose: () => void;

  members: GroupMember[];
  selectedId: number | null;
  loading?: boolean;

  onConfirm: (member: GroupMember) => void;
}

export default function AssigneeBottomSheet({
  open,
  onClose,
  members,
  selectedId,
  loading = false,
  onConfirm,
}: AssigneeBottomSheetProps) {
  const [localId, setLocalId] = useState<number | null>(selectedId);

  // 바텀시트 열릴 때만 초기 선택값 동기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setLocalId(selectedId);
  }, [open, selectedId]);

  // 현재 선택된 멤버
  const picked = useMemo(
    () => members.find((m) => m.memberId === localId) ?? null,
    [members, localId]
  );

  return (
    <BottomSheet open={open} onClose={onClose} height="533px" showHeaderDivider={false}>
      <div className="flex flex-col h-full">
        <h1 className='text-display-s text-black mt-6'>
            누구에게 부탁할까요?
        </h1>
        <div className="mt-6 flex-1 overflow-y-auto px-1 space-y-2">
          {loading ? (
            <div className="text-body-m text-gray-500 px-3 py-2">
              불러오는 중…
            </div>
          ) : members.length === 0 ? (
            <div className="text-body-m text-gray-400 px-3 py-4 text-center">
              멤버가 없습니다
            </div>
          ) : (
            members.map((m) => {
              const active = m.memberId === localId;

              return (
                <button
                  key={m.memberId}
                  type="button"
                  onClick={() => setLocalId(m.memberId)}
                  className={[
                    'w-full flex items-center gap-2 rounded-xl px-3 py-4 transition',
                    active
                      ? 'border border-primary bg-primary-50'
                      : 'bg-white',
                  ].join(' ')}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {m.profileImageUrl ? (
                      <img
                        src={m.profileImageUrl}
                        alt={m.nickname}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        👤
                      </div>
                    )}
                  </div>

                  <span className="text-body-m-bold text-gray-800">
                    {m.nickname}
                  </span>

                  {/* {m.role === 'OWNER' && (
                    <span className="ml-auto text-body-s text-primary">
                      방장
                    </span>
                  )} */}
                </button>
              );
            })
          )}
        </div>

        <BottomCTAWrapper fixed showTopBorder>
          <BottomCTAButton
            label="지정하기"
            disabled={!picked}
            onClick={() => {
              if (!picked) return;
              onConfirm(picked);
              onClose();
            }}
          />
        </BottomCTAWrapper>
      </div>
    </BottomSheet>
  );
}
