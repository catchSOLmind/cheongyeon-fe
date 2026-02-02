import ImgFinish from '@/assets/todo/feedback/img-finish.png';
import Header from '@/shared/components/Header';
import { BottomCTAWrapper }from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';

function FeedbackFinishPage() {
  return (
    <div>
      <Header title="피드백 남기기" showBackButton />
      <img src={ImgFinish} alt="FeedbackFinishPage" />
      <h1>FeedbackFinishPage</h1>
      <BottomCTAWrapper>
        <BottomCTAButton label="피드백 남기기">
        </BottomCTAButton>
      </BottomCTAWrapper>
    </div>
  );
}

export default FeedbackFinishPage;