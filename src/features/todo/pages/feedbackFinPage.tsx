import ImgFinish from '@/assets/todo/feedback/img-finish.png';
import Header from '@/shared/components/Header';
import { BottomCTAWrapper }from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';

function FeedbackFinishPage() {
  return (
    <div className="min-h-screen">
    <Header title="피드백 남기기" showBackButton />
    <img
        src={ImgFinish}
        alt="FeedbackFinishPage"
        className="mx-auto mt-14 w-[152px] h-[162px] object-cover"
    />
    <div className="mt-14 text-center text-display-xs text-black">
    피드백 제출을 완료했어요
    </div>
    <div className="mt-2 text-center text-body-m text-gray-800">
    모아진 피드백은 우리집 리포트에서 확인할 수 있어요!
    </div>
    <BottomCTAWrapper className='mt-[227px]'>
        <BottomCTAButton label="우리집으로 돌아가기" />
    </BottomCTAWrapper>
    </div>

);
}


export default FeedbackFinishPage;