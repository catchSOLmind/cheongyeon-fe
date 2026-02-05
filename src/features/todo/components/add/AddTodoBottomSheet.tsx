import { useEffect, useState } from 'react';
import Header from '@/shared/components/Header';
import { getCategoryList } from '../../api/todoApi';
import type { CategoryItem, CategoryType } from '../../types/category.types';
import AddTodoListItem from './AddTodoListItem';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import ImgSearch from '@/assets/todo/icon-search.svg';
import { addMyTasks } from '../../api/myWorkApi';


interface AddTodoBottomSheetProps {
  categoryType: CategoryType;
  name?: string;
  favorite?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

function AddTodoBottomSheet({
  categoryType: categoryType,
  isOpen,
  onClose,
}: AddTodoBottomSheetProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isFavorite , setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCount = selectedIds.length;


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getCategoryList({
          category: categoryType,
          favorite: isFavorite,
        });
        if (response.isSuccess && response.result) {
          setCategories(response.result.items);
        }
      } catch (error) {
        console.error('카테고리 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, categoryType, isFavorite, searchQuery]);

  const handleSelectItem = (item: CategoryItem) => {
  setSelectedIds((prev) =>
    prev.includes(item.taskTypeId)
      ? prev.filter((id) => id !== item.taskTypeId) // 선택 해제
      : [...prev, item.taskTypeId]                  // 선택
  );}

  const handleAddTasks = async () => {
  if (selectedIds.length === 0) return;

  try {
    await addMyTasks({
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      taskTypeIds: selectedIds,
    });

    // 성공 → 바텀시트 닫기
    onClose();
  } catch (error) {
    console.error('할 일 추가 실패:', error);
    alert('할 일 추가에 실패했어요. 다시 시도해주세요.');
  }
};

  return (
    
    <>
      {/* 오버레이 - 검정색 투명 처리 (헤더 포함) */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-[60] 
          transition-opacity duration-200
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div className={`
        fixed inset-x-0 bottom-0 z-[70] 
        bg-white rounded-t-3xl shadow-lg 
        flex flex-col 
        top-3
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* 드래그 핸들 */}
        <button
          onClick={onClose}
          className="flex justify-center pt-3 pb-2 w-full cursor-pointer"
          aria-label="바텀시트 닫기"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </button>

        {/* 헤더 */}
        <Header
          title='할 일 추가'
          showBackButton
          onBackClick={onClose}
        />

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 검색 */}
          <div className="relative mb-4">
            <img src={ImgSearch} alt="검색" className="absolute w-[18px] h-[18px] ml-3 mt-2" />
            <input
              type="text"
              placeholder="할 일을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-9 rounded-lg text-body-m bg-gray-200 text-[#A6A6A6]"
            />
          </div>

          {/* 목록 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-body-m text-gray-600">로딩 중...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-2">
             {categories.map((item) => (
                <AddTodoListItem
                  key={item.taskTypeId}
                  item={item}
                  isSelected={selectedIds.includes(item.taskTypeId)}
                  onClick={handleSelectItem}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-body-m text-gray-600 mb-2">할 일이 없습니다</p>
              <p className="text-body-s text-gray-400">
                {searchQuery ? '검색 결과가 없습니다' : '카테고리에 할 일이 없습니다'}
              </p>
            </div>
          )}
        </div>
          <BottomCTAWrapper sticky showTopBorder>
          <BottomCTAButton
            label={
              selectedCount === 0
                ? '할 일을 선택해주세요'
                : `${selectedCount}개 추가하기`
            }
            disabled={selectedCount === 0}
            onClick={handleAddTasks}
          />
        </BottomCTAWrapper>
      </div>
    </>
  );
}

export default AddTodoBottomSheet;