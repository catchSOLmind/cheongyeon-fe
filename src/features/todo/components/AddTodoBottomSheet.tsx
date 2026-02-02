import { useEffect, useState } from 'react';
import Header from '@/shared/components/Header';
import { getCategoryList } from '../api/todoApi';
import type { Category } from '../types/category.types';

interface AddTodoBottomSheetProps {
  categoryId: string;
  categoryName: string;
  isOpen: boolean;
  onClose: () => void;
}

function AddTodoBottomSheet({
  categoryId,
  categoryName,
  isOpen,
  onClose,
}: AddTodoBottomSheetProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          category: categoryId,
          q: searchQuery || undefined,
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
  }, [isOpen, categoryId, searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 - 검정색 투명 처리 (헤더 포함) */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div className="fixed inset-x-0 top-3 bottom-0 z-[70] bg-white rounded-t-3xl shadow-lg flex flex-col transform transition-transform duration-300 ease-out">
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
          title={categoryName}
          showBackButton
          onBackClick={onClose}
        />

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 검색 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="할 일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-body-m focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 목록 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-body-m text-gray-600">로딩 중...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.taskTypeId}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-body-m-bold text-black mb-1">
                        {category.name}
                      </h3>
                      <p className="text-body-s text-gray-600">{category.category}</p>
                    </div>
                    {category.isFavorite && (
                      <span className="text-xl">⭐</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-body-m text-gray-600 mb-2">할 일이 없습니다</p>
              <p className="text-body-s text-gray-400">
                {searchQuery ? '검색 결과가 없습니다' : '할 일을 추가해보세요'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddTodoBottomSheet;
