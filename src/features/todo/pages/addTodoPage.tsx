import Header from "@/shared/components/Header";

function AddTodoPage() {
  return (
    <div className="min-h-screen bg-white p-5">
        <Header title="할 일 추가" showBackButton />
      <h1 className="text-display-m text-gray-900 mb-4">할 일 추가하기</h1>
      {/* TODO: 할 일 추가 폼 구현 */}
    </div>
  );
}

export default AddTodoPage;
