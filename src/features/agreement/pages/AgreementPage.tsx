// src/pages/AgreementPage.tsx

import Header from "@/shared/components/Header";
import Steppers from "../components/Steppers";
import { BottomCTAWrapper } from "@/shared/components/BottomCTAWrapper";
import { BottomCTAButton } from "@/shared/components/BottomCTAButton";
import CalendarBottomSheet from "@/shared/components/CalendarBottomSheet";
import { useState } from "react";
import { useUserStore } from "@/features/auth/stores/useUserStore";
import ImageDefault from "@/assets/common/img-default-profile.svg"
import { useGroupInvite } from "../hooks/useGroupInvite";

export default function AgreementPage() {

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);

  const avatarUrl = useUserStore((s) => s.profile?.profileImageUrl);
  const profile = useUserStore((s) => s.profile);
  console.log(profile)

  const { createAndShare, isLoading } = useGroupInvite();


  const handleInvite = async () => {
      await createAndShare({
        title: '🎉 그룹에 초대합니다!',
        description: '함께 활동해요!',
        imageUrl: 'https://your-image-url.com/group-thumbnail.jpg',
      });
    };



  return (
    <div className="min-h-screen bg-white">
    <Header title="협약서 멤버 초대하기" showBackButton/>
      <div className="mx-auto w-full max-w-[390px] px-5">
        {/* Stepper */}
        <Steppers step={1}/>
        {/* Title */}
        <div className="mt-3">
          <h1 className="text-display-m text-black whitespace-pre-line">
            멤버를 초대하고{'\n'}협약서를 작성해보세요
          </h1>
          <p className="mt-2 text-body-m text-gray-700">
            멤버와 협약서 확인과 동의가 가능해요
          </p>
        </div>

        {/* Invite area */}
        <div className="mt-12">
          <div className="flex items-start gap-3">
            {/* Invite (plus) */}
            <div className="flex flex-col items-center gap-2">
            <button 
                onClick={handleInvite}
                disabled={isLoading}
                className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
              <div className="text-body-m text-gray-900">초대(1/5)</div>
            </div>

            {/* Me avatar */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="내 프로필"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src = {ImageDefault}/>
                  )}
                </div>
                <span className="text-primary text-body-m-bold">나</span>
              </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-12">
          <h2 className="text-base font-semibold text-gray-900">협약서 작성 마감일</h2>

          <div className="mt-5">
            <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="w-full rounded-[12px] border border-gray-300 bg-[#FAFAFA] px-4 py-4
                          flex items-center justify-between"
              >
                <span
                  className={`text-body-m-bold ${
                    deadline ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {deadline
                    ? `${deadline.getFullYear()}.${deadline.getMonth() + 1}.${deadline.getDate()}`
                    : '날짜 선택'}
                </span>
              </button>
            <p className="mt-[10px] text-body-s text-gray-600">
              마감일 이후에는 협약서를 다시 작성해야 해요.
            </p>
          </div>
          <CalendarBottomSheet
            open={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            year={2026}
            month={2}
            monthLabel="26년 2월"
            value={deadline}               // 현재 선택값 내려줌
            onChange={(date) => {
              setDeadline(date);         
            }}
            onConfirm={(date) => {
              setDeadline(date);           
              setIsCalendarOpen(false);    // 닫기
            }}
          />
        </div>

        {/* Bottom button (disabled) */}
        <BottomCTAWrapper fixed>
            <BottomCTAButton label="다음단계"/>
        </BottomCTAWrapper>
      </div>
    </div>
  );
}
