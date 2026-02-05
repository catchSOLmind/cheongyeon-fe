import DropdownSelect from '@/features/todo/components/feedback/DropdownSelect';
import MemberChoiceItem from '@/features/todo/components/feedback/MemberChoiceItem';

type Props = {
    labelId: string;  
    value: string;
    maxLength: number;
    categoryName?: string;
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
    onSelectCategory: (categoryId: string) => void;
    onChangeText: (text: string) => void;
    categories: { id: string; name: string }[];
  };
  
  export default function FeedbackField({
    value,
    maxLength,
    categoryName,
    isDropdownOpen,
    onToggleDropdown,
    onSelectCategory,
    onChangeText,
    categories,
  }: Props) {
    return (
      <div className="mb-6">
        <div className="mb-4">
          <DropdownSelect
            isOpen={isDropdownOpen}
            onToggle={onToggleDropdown}
            selectedValue={categoryName ?? null}
            placeholder="카테고리를 선택해주세요"
            displayValue={categoryName}
          >
            <div className="px-4 py-2">
              {categories.map((c) => (
                <MemberChoiceItem
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  isSelected={c.name === categoryName}
                  onClick={() => onSelectCategory(c.id)}
                />
              ))}
            </div>
          </DropdownSelect>
        </div>
  
        <textarea
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="예: 설거지할 때 그릇 뒤쪽도 닦아주면 좋을 것 같아요"
          className="w-full h-[162px] px-4 py-3 border border-gray-300 rounded-lg text-body-m bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
  
        <p className="text-body-s text-gray-400 mt-2 text-left">
          글자수 제한: <span className="text-semantic-badge">{value.length}</span>/{maxLength}
        </p>
      </div>
    );
  }
  