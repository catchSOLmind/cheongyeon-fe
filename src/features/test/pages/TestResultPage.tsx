

import { useLocation } from "react-router-dom";
import type { TestResult } from "@/features/test/types/test.types";
import { TopResultCard } from "../components/ResultCard";
import RecommendCard from "../components/RecommendCard";
import LogoHeader from "@/shared/components/LogoHeader";
import { useNavigate } from "react-router-dom";
import IconRetry from "@/assets/test/icon-retry.svg";
import ImgAgree from "@/assets/test/img-agreement.png";
import Iconright from "@/assets/common/icon-right.svg";


export default function TestResultPage() {
  const location = useLocation();
  const result = (location.state as { result?: TestResult })?.result;
  const navigate = useNavigate();
  const { title, tags, description, cautionPoint } = result || {};


  if (!result) {
    return <div>결과가 없습니다. 다시 테스트를 진행해주세요.</div>;
  }

  return (
    <div className="pb-24"  >
      <LogoHeader title="우리집" />
      {/* page container */}
      <div className="mx-auto w-full max-w-[420px] px-5 pb-28 pt-4 bg-gray-50]">
        <TopResultCard
          title={result.title}
          subTitle={result.subTitle}
          mainQuote={result.mainQuote}
          resultType={result.resultType}
        />
          {/* tags */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {tags?.map((b) => (
              <span
                key={b}
                className="flex items-center justify-center rounded-full bg-primary-50 py-2 text-body-m text-primary-900"
              >
                {b}
              </span>
            ))}
          </div>
          </div>

          {/* 2) Type score section */}
          <div className="mt-6">
            <h2 className="text-base font-semibold text-gray-900">{title} 유형은?</h2>
            <p className="mt-1 text-sm text-gray-500">
              {description}
              <br />
              한 번 시작한 청소는 끝을 보는 타입!
            </p>
          </div>

          {/* 3) Recommended tasks */}
          <div className="px-5">
            <RecommendCard resultType={result.resultType} />
          </div>

       {/* 4) Warning */}
       <div className="px-5">
      <div className="mt-4 bg-white px-5 py-12" style={{ borderRadius: '0 0 20px 20px' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="text-yellow-600">⚠️</div>
            <h4 className="text-display-xs text-black">주의 포인트</h4>
          </div>
          <p className="mt-3 text-body-m text-gray-800 text-center">
            {cautionPoint?.split('.').map((line, i) => (
              line.trim() && <span key={i}>{line.trim()}<br /></span>
            ))}
          </p>
        </div>
      </div>
      </div>
        {/*협약서 페이지로 이동하기 */}

        <div
          className="
            mt-9 relative rounded-[12px] overflow-hidden mx-5
            bg-[#DFF6F8]
            px-6 py-8">
          {/* 배경 이미지 */}
          <div
            className="
              absolute inset-0
              bg-no-repeat bg-right bg-contain mt-10
              pointer-events-none
            "
            style={{
              backgroundImage: `url(${ImgAgree})`,
            }}
          />
              <div className="relative z-10">
                <h2 className="text-display-xs text-primary-600 mb-10">
                  우리집 청소 규칙을 정해볼까요?
                </h2>

                <button
                  type="button"
                  className="
                    inline-flex items-center gap-1
                    bg-white
                    px-[6px] py-[8px]
                    rounded-[4px]
                    text-body-m text-gray-800
                  "
                  onClick={() => navigate('/agreement')}>
                  우리집 협약서 작성 시작하기
                  <img src= {Iconright} className="w-5 h-5"/>
                </button>
              </div>
            </div>


        {/* 5) bottom fixed actions */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
          <div className="mx-auto flex w-full max-w-[420px] gap-3 px-4 py-3">
              <button
                  type="button"
                  className="flex h-14 w-20 items-center justify-center rounded-lg bg-white border border-gray-200"
                  aria-label="다시하기"
                  onClick={() => {
                      navigate("/test-start");
                  }}
                >
              <img src={IconRetry} alt="다시하기 아이콘" />
              </button>

           <button
             type="button"
             className="h-14 flex-1 rounded-lg bg-primary text-body-l-bold text-white"
             onClick={() => {
               // TODO: 공유하기 로직
             }}
           >
             친구에게 공유하기
           </button>
         </div>
       </div>
     </div>
  );
}
