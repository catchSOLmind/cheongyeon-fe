import { useEffect, useMemo, useState } from 'react';
import Header from '@/shared/components/Header';
import { getCategoryList } from '../../api/todoApi';
import type { CategoryItem, CategoryType } from '../../types/category.types';
import AddTodoListItem from './AddTodoListItem';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import ImgSearch from '@/assets/todo/icon-search.svg';
import { useNavigate } from 'react-router-dom';
import { useTaskDraftStore } from '../../stores/useTaskDraftStore';
import type { TaskDraft } from '../../stores/useTaskDraftStore';

interface AddTodoBottomSheetProps {
  categoryType: CategoryType;
  name?: string;
  favorite?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

function AddTodoBottomSheet({
  categoryType,
  isOpen,
  onClose,
}: AddTodoBottomSheetProps) {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isFavorite] = useState(false); // TODO: 추후 즐겨찾기 토글로 변경
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCount = selectedIds.length;

  // zustand
  const storedDrafts = useTaskDraftStore((s) => s.drafts);
  const setDrafts = useTaskDraftStore((s) => s.setDrafts);

  // 바텀시트 열림/닫힘 시 body scroll 제어
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

  // 바텀시트 닫힐 때 선택 초기화
  useEffect(() => {
    if (!isOpen) setSelectedIds([]);
  }, [isOpen]);

  // 카테고리 목록 조회
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getCategoryList({
          category: categoryType,
          favorite: isFavorite,
          // q: searchQuery,
        });

        if (response.isSuccess && response.result) {
          setCategories(response.result.items);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('카테고리 목록 조회 실패:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, categoryType, isFavorite]);

  const handleSelectItem = (item: CategoryItem) => {
    setSelectedIds((prev) =>
      prev.includes(item.taskTypeId)
        ? prev.filter((id) => id !== item.taskTypeId)
        : [...prev, item.taskTypeId]
    );
  };

  // 클라이언트 검색 필터
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const handleAddTasks = () => {
    if (selectedIds.length === 0) return;

    const now = new Date();
    const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const time = now.toTimeString().slice(0, 5); // HH:mm
    const weekday = now.getDay(); // 0~6

    // selectedIds -> 실제 item들 뽑기
    const selectedItems = categories.filter((c) =>
      selectedIds.includes(c.taskTypeId)
    );

    // 이번에 선택한 draft 생성
    const newDrafts: TaskDraft[] = selectedItems.map((it) => ({
      taskTypeId: it.taskTypeId,
      taskName: it.name,
      point: it.point,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isFavorite: (it as any).isFavorite ?? false, // 즐겨찾기 로직 추후 수정
      date,
      time,
      weekday,
      assigneeId: undefined,
      assigneeName: undefined,
    }));

    // 기존에 있던 것 + 새로 추가된 것 
    setDrafts([...storedDrafts, ...newDrafts]);


    onClose();
    navigate('/calendar/task');
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-[60]
          transition-opacity duration-200
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-[70]
          bg-white rounded-t-3xl shadow-lg
          flex flex-col
          top-3
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* 드래그 핸들 */}
        <button
          type="button"
          onClick={onClose}
          className="flex justify-center pt-3 pb-2 w-full cursor-pointer"
          aria-label="바텀시트 닫기"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </button>

        {/* 헤더 */}
        <Header title="할 일 추가" showBackButton onBackClick={onClose} />

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 검색 */}
          <div className="relative mb-4">
            <img
              src={ImgSearch}
              alt="검색"
              className="absolute w-[18px] h-[18px] left-3 top-1/2 -translate-y-1/2"
            />
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
          ) : filteredCategories.length > 0 ? (
            <div className="space-y-2">
              {filteredCategories.map((item) => (
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

        {/* 하단 CTA */}
        <BottomCTAWrapper sticky showTopBorder>
          <BottomCTAButton
            label={selectedCount === 0 ? '0개 추가하기' : `${selectedCount}개 추가하기`}
            disabled={selectedCount === 0}
            onClick={handleAddTasks}
          />
        </BottomCTAWrapper>
      </div>
    </>
  );
}

export default AddTodoBottomSheet;
