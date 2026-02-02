// features/todo/pages/FeedbackPage.tsx
import { useState } from 'react';
import Header from '@/shared/components/Header';
import MemberChoiceItem from '../components/MemberChoiceItem';
import CategoryChoiceItem from '../components/CategoryChoiceItem';
import DropdownSelect from '../components/DropdownSelect';
import Stamp01 from '@/assets/todo/feedback/icon-stemp-01.svg';
import Stamp02 from '@/assets/todo/feedback/icon-stemp-02.svg';
import Stamp03 from '@/assets/todo/feedback/icon-stemp-03.svg';
import Stamp04 from '@/assets/todo/feedback/icon-stemp-04.svg';
import Stamp05 from '@/assets/todo/feedback/icon-stemp-05.svg';
import Stamp06 from '@/assets/todo/feedback/icon-stemp-06.svg';
import Stamp01Fill from '@/assets/todo/feedback/icon-stemp-01-fill.svg';
import Stamp02Fill from '@/assets/todo/feedback/icon-stemp-02-fill.svg';
import Stamp03Fill from '@/assets/todo/feedback/icon-stemp-03-fill.svg';
import Stamp04Fill from '@/assets/todo/feedback/icon-stemp-04-fill.svg';
import Stamp05Fill from '@/assets/todo/feedback/icon-stemp-05-fill.svg';
import Stamp06Fill from '@/assets/todo/feedback/icon-stemp-06-fill.svg';

import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';


interface ComplimentSticker {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconFill: string;
}

const complimentStickers: ComplimentSticker[] = [
  { id: '1', title: '꼼꼼왕', description: '꼼꼼하게\n잘 해요', icon: Stamp01, iconFill: Stamp01Fill },
  { id: '2', title: '시간엄수', description: '시간을\n잘 지켜요', icon: Stamp02, iconFill: Stamp02Fill },
  { id: '3', title: '먼지킬러', description: '먼지 하나\n 없어요', icon: Stamp03, iconFill: Stamp03Fill },
  { id: '4', title: '향기왕', description: '향기까지\n 신경써요', icon: Stamp04, iconFill: Stamp04Fill },
  { id: '5', title: '포인트왕', description: '업무를 \n많이 했어요', icon: Stamp05, iconFill: Stamp05Fill },
  { id: '6', title: '정리정돈', description: '정리정돈 \n완벽', icon: Stamp06, iconFill: Stamp06Fill },
];

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
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const maxLength = 100;

  const selectedMemberData = mockMembers.find((m) => m.id === selectedMember);
  const selectedCategoryData = mockCategories.find((c) => c.id === selectedCategory);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(memberId);
    setIsMemberDropdownOpen(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCategoryDropdownOpen(false);
  };

  const handleStickerClick = (stickerId: string) => {
    setSelectedStickers((prev) =>
      prev.includes(stickerId) ? prev.filter((id) => id !== stickerId) : [...prev, stickerId]
    );
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setFeedbackText(value);
    }
  };

  const isValid = false; // TODO: 실제 검증 로직 연결

  const handleSubmit = () => {
    console.log('피드백 제출');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="피드백 남기기" showBackButton />

      <div className="px-5 py-5">
        {/* 받는 사람 섹션 */}
        <div className="mb-9">
          <label className="block text-body-l-bold text-black mb-4">받는 사람</label>
          <DropdownSelect
            isOpen={isMemberDropdownOpen}
            onToggle={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
            selectedValue={selectedMember}
            placeholder="멤버를 선택해주세요"
            displayValue={selectedMemberData?.name}
            showProfile={true}
            showTag={selectedMemberData?.tag}
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
            <span className="px-2 py-1 bg-semantic-badge text-white text-label-m rounded-lg">
              AI 매니저
            </span>
          </div>
          <p className="text-body-m text-gray-800 mb-4">
            자유롭게 작성하면 AI가 정돈해서 전달합니다.
          </p>

          {/* 카테고리 드롭다운 */}
          <div className="mb-4">
            <DropdownSelect
              isOpen={isCategoryDropdownOpen}
              onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              selectedValue={selectedCategory}
              placeholder="카테고리를 선택해주세요"
              displayValue={selectedCategoryData?.name}
            >
              <div className="px-4 py-2">
                {mockCategories.map((category) => (
                  <CategoryChoiceItem
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    isSelected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                  />
                ))}
              </div>
            </DropdownSelect>
          </div>

          {/* 텍스트 영역 */}
          <div>
          <textarea
              value={feedbackText}
              onChange={handleFeedbackChange}
              placeholder="예: 설거지할 때 그릇 뒤쪽도 닦아주면 좋을 것 같아요"
              className="w-full h-[162px] px-4 py-3 border border-gray-300 rounded-lg text-body-m bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <p className="text-body-s text-gray-400 mt-2 text-left">
              글자수 제한: {feedbackText.length}/{maxLength}
            </p>
            <button className="w-full mt-4 px-4 h-[42px] bg-gray-50 text-body-m-bold border border-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
              + 피드백 추가하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <BottomCTAWrapper>
        <BottomCTAButton
          label="피드백 작성완료"
          disabled={!isValid}
          onClick={handleSubmit}
        />
      </BottomCTAWrapper>
    </div>
  );
}

export default FeedbackPage;