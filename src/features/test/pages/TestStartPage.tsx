import ImgTestStart from "@/assets/test/img-cheongyeon-test.png";
import { BottomCTAButton } from "@/shared/components/BottomCTAButton";
import { BottomCTAWrapper } from "@/shared/components/BottomCTAWrapper";
import { useNavigate } from "react-router-dom";


export default function TestStartPage() {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/calendar');
    console.log('Test skipped, navigating to /calendar');
  };

  return (
    <div className="min-h-dvh w-full bg-primary-50 flex flex-col">
      {/* 상단 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-14">
        <p className="text-center text-body-m text-gray-700">
          나의 청소 성향 테스트
        </p>

        <h1 className="mt-2 text-center text-[28px] font-extrabold text-gray-900">
          나의 청소 DNA는?
        </h1>

        {/* 일러스트 */}
        <div className="mt-3 px-[42px] w-full">
          <img
            src={ImgTestStart}
            alt="청소 DNA 테스트"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* 건너뛰기 */}
      <div className="flex justify-center pb-1">
        <button
          type="button"
          className="text-label-l-regular text-gray-600 underline underline-offset-4"
          onClick={() => {
            handleSkip();
          }}
        >
          건너뛰기
        </button>
      </div>

      {/* 하단 CTA */}
      <BottomCTAWrapper className="!bg-primary-50">
        <div className="space-y-3">
          <BottomCTAButton
            label="테스트 시작하기"
            onClick={() => {
              navigate("/test");
            }}
          />

          <button
            type="button"
            className="w-full h-[56px] rounded-lg border border-gray-200 bg-white text-body-l-bold text-primary"
          >
            테스트 공유하기
          </button>
        </div>
      </BottomCTAWrapper>
    </div>
  );
}
