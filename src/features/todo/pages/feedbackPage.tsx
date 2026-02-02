// features/todo/pages/FeedbackPage.tsx
import { useState } from 'react';
import Header from '@/shared/components/Header';
import MemberChoiceItem from '../components/MemberChoiceItem';
import DropdownSelect from '../components/DropdownSelect';
import FeedbackField from '../components/FeedbackField';
import { useFeedbackFields } from '../hooks/useFeedbackFields';
import { complimentStickers } from '../data/feedbackStamps';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';


// TODO: API 연동 후 제거
const mockMembers = [
  { id: '1', name: '멤버 1', tag: '효율이' },
  { id: '2', name: '멤버 2', tag: '태그1' },
  { id: '3', name: '멤버 3', tag: '태그2' },
  { id: '4', name: '멤버 4', tag: '태그2' },
];

const mockCategories = [
  { id: '1', name: '화장실' },
  { id: '2', name: '주방' },
  { id: '3', name: '빨래' },
  { id: '4', name: '침실' },
  { id: '5', name: '거실' },
  { id: '6', name: '쓰레기' },
];

function FeedbackPage() {
  const maxLength = 100;
  const maxFeedbackCount = 5;

  //멤버 선택
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);

  // 칭찬 스티커 선택
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);

  // 피드백 필드 추가 훅
    const {
      feedbacks,
      canAdd,
      addFeedback,
      toggleCategoryDropdown,
      selectCategory,
      changeText,
      //removeFeedback,
    } = useFeedbackFields({
      maxFeedbackCount,
      initialCount: 1,
      maxLength,
    });
    
  // 피드백 받는 멤버
  const selectedMemberData = mockMembers.find((m) => m.id === selectedMember);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(memberId);
    setIsMemberDropdownOpen(false);
  };

  const handleStickerClick = (stickerId: string) => {
    setSelectedStickers((prev) =>
      prev.includes(stickerId) ? prev.filter((id) => id !== stickerId) : [...prev, stickerId]
    );
  };

  const isValid =
    !!selectedMember &&
    (selectedStickers.length > 0 || feedbacks.some((f) => f.text.trim().length > 0));

  const handleSubmit = () => {
    console.log('피드백 제출', {
      selectedMember,
      selectedStickers,
      feedbacks,
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="피드백 남기기" showBackButton />

      <div className="px-5 py-5">
        {/* 피드백 받는 사람 섹션 */}
        <div className="mb-9">
          <label className="block text-body-l-bold text-black mb-4">받는 사람</label>
          <DropdownSelect
            isOpen={isMemberDropdownOpen}
            onToggle={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
            selectedValue={selectedMember}
            placeholder="멤버를 선택해주세요"
            displayValue={selectedMemberData?.name ?? undefined}
            showProfile={true}
            showTag={selectedMemberData?.tag ?? undefined}
          >
            {mockMembers.map((member) => (
              <MemberChoiceItem
                key={member.id}
                id={member.id}
                name={member.name}
                tag={member.tag}
                isSelected={selectedMember === member.id}
                onClick={() => handleMemberSelect(member.id)}
              />
            ))}
          </DropdownSelect>
        </div>

        {/* 칭찬 스티커 섹션 */}
        <div className="mb-9">
          <label className="block text-body-l-bold text-black mb-2.5">칭찬 스티커</label>
          <div className="grid grid-cols-3 gap-2.5">
            {complimentStickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => handleStickerClick(sticker.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    selectedStickers.includes(sticker.id)
                      ? 'border-primary bg-[#EFFBFD]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-[77/52] flex items-center justify-center max-w-[77px] mx-auto">
                    <img
                      src={selectedStickers.includes(sticker.id) ? sticker.iconFill : sticker.icon}
                      alt={sticker.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className={`text-label-l whitespace-pre-line text-center ${
                      selectedStickers.includes(sticker.id) ? 'text-gray-800' : 'text-semantic-notify'
                    }`}
                  >
                    {sticker.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 개선 피드백 섹션 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-body-l-bold text-black">개선 피드백</label>
            <span className="px-2 py-1 bg-semantic-badge text-white text-label-m rounded-lg">AI 매니저</span>
          </div>

          <p className="text-body-m text-gray-800 mb-4">
            자유롭게 작성하면 AI가 정돈해서 전달합니다.
          </p>

          {/* FeedbackField로 반복 렌더 */}
          {feedbacks.map((f, idx) => {
            const categoryName = mockCategories.find((c) => c.id === f.categoryId)?.name ?? null;

            return (
              <FeedbackField
                key={f.id}
                labelId={`feedbackText-${idx}`}
                value={f.text}
                maxLength={maxLength}
                categories={mockCategories}
                categoryName={categoryName ?? undefined}
                isDropdownOpen={f.isDropdownOpen}
                onToggleDropdown={() => toggleCategoryDropdown(f.id)}
                onSelectCategory={(categoryId) => selectCategory(f.id, categoryId)}
                onChangeText={(text) => changeText(f.id, text)}
              />
            );
          })}

          <button
            type="button"
            onClick={addFeedback}
            disabled={!canAdd}
            className={`w-full mt-4 px-4 h-[42px] text-body-m-bold border rounded-lg flex items-center justify-center gap-2 transition-colors
              ${
                canAdd
                  ? 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-200'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            + 피드백 추가하기
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <BottomCTAWrapper>
        <BottomCTAButton label="피드백 작성완료" disabled={!isValid} onClick={handleSubmit} />
      </BottomCTAWrapper>
    </div>
  );
}

export default FeedbackPage;
