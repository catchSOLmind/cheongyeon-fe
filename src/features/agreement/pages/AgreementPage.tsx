// src/pages/AgreementPage.tsx

import Header from "@/shared/components/Header";
import Steppers from "../components/Steppers";
import { BottomCTAWrapper } from "@/shared/components/BottomCTAWrapper";
import { BottomCTAButton } from "@/shared/components/BottomCTAButton";


export default function AgreementPage() {
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
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
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
              </div>
              <div className="text-xs text-gray-500">초대(1/5)</div>
            </div>

            {/* Me avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {/* 이미지 자리 */}
                <div className="w-full h-full bg-gray-200" />
              </div>
              <div className="text-xs text-gray-500">나</div>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-12">
          <h2 className="text-base font-semibold text-gray-900">협약서 작성 마감일</h2>

          <div className="mt-5">
            <div className="rounded-[12px] border border-gray-300 bg-[#FAFAFA] px-4 py-4">
              <div className="text-body-m-bold text-gray-500">날짜 선택</div>
            </div>

            <p className="mt-[10px] text-body-s text-gray-600">
              마감일 이후에는 협약서를 다시 작성해야 해요.
            </p>
          </div>
        </div>

        {/* Bottom button (disabled) */}
        <BottomCTAWrapper fixed>
            <BottomCTAButton label="다음단계"/>
        </BottomCTAWrapper>
      </div>
    </div>
  );
}
