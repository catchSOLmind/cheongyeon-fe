import Header from "@/shared/components/Header";

function FeedbackPage() {
  return (
    <div className="min-h-screen bg-white">
        <Header title="피드백 남기기" showBackButton />
      <h1 className="text-display-m text-gray-900 mb-4">피드백 남기기</h1>
      {/* TODO: 피드백 폼 구현 */}
    </div>
  );
}

export default FeedbackPage;
