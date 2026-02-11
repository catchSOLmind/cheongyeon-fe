// src/features/todo/pages/AddTodoPage.tsx
import { useEffect, useMemo, useState } from 'react';
import Header from '@/shared/components/Header';
import { TodoItem } from '../components/TodoItem';
import AddTodoBottomSheet from '../components/add/AddTodoBottomSheet';
import type { CategoryType } from '../types/category.types';
import { categories } from '../data/categoryTypeImages';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';

import { useTaskDraftStore } from '../stores/useTaskDraftStore';
import type { DraftTaskItemData } from '../types/draftTask.types';
import { useNavigate } from 'react-router-dom';
import { useFavoriteStore } from '../stores/useFavoritrStore';

import { addMyTasks } from '../api/myWorkApi';
import EditDraftFlowBottomSheet from '../components/EditDraftBottomsheet';

// 프로필 가져오기
import { useUserStore } from '@/features/auth/stores/useUserStore';

function AddTodoPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isFavoriteMode, setIsFavoriteMode] = useState(false);
  const [editDraftId, setEditDraftId] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setSelectedCategory(null);
    setIsFavoriteMode(false);
  };

  const handleCategoryClick = (categoryType: CategoryType | '') => {
    if (!categoryType) {
      setIsFavoriteMode(true);
      setSelectedCategory(null);
      setIsBottomSheetOpen(true);
      return;
    }

    setIsFavoriteMode(false);
    setSelectedCategory(categoryType);
    setIsBottomSheetOpen(true);
  };

  const drafts = useTaskDraftStore((s) => s.drafts);
  const clearDrafts = useTaskDraftStore((s) => s.clear);

  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);
  const fetchFavorites = useFavoriteStore((s) => s.fetchFavorites);

  // 내 프로필
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

const todos: DraftTaskItemData[] = useMemo(() => {
  return drafts.map((draft) => {
    const assigneeNickname =
      draft.assignee?.nickname ?? profile?.nickname ?? '미지정';

    const assigneeProfileImageUrl =
      draft.assignee?.profileImageUrl ??
      profile?.profileImageUrl ??
      null;

    const repeat =
      draft.repeat && draft.repeat.enabled
        ? draft.repeat
        : undefined;

    return {
      id: String(draft.draftId), // string 보장
      taskTypeId: draft.taskTypeId,
      categoryType: draft.categoryType,
      title: draft.taskName,
      date: draft.date,
      time: draft.time ?? null,
      points: draft.point,

      // DraftAssignee 타입에 정확히 맞춤
      assignee: {
          memberId: draft.assignee?.memberId ?? 0, // profile은 관여 안 함
          nickname: assigneeNickname,
          profileImageUrl: assigneeProfileImageUrl,
        },

      repeat,

      isFavorite: favoriteIds.has(draft.taskTypeId),
      isCompleted: false,
    };
  });
}, [
  drafts,
  favoriteIds,
  profile?.nickname,
  profile?.profileImageUrl,
]);


const handleSubmitToCalendar = async () => {
  if (drafts.length === 0) return;

  try {
    const tasks = drafts.map((d) => ({
      date: d.date,                 // draft별 날짜
      taskTypeId: d.taskTypeId,     // 단건
      time: d.time ?? null,
      assigneeMemberId: d.assignee?.memberId ?? 0, // 미지정 처리 정책에 맞게(0 or null)
      repeat: {
        enabled: !!d.repeat?.enabled,
        daysOfWeek: d.repeat?.enabled ? d.repeat.daysOfWeek : [],
      },
    }));

    await addMyTasks({ tasks });

    clearDrafts();
    navigate('/calendar');
  } catch {
    alert('캘린더 추가에 실패했어요. 다시 시도해주세요.');
  }
};


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header title="할 일 추가" showBackButton />

      <div className="px-5 py-6 pb-16">
        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-4 gap-[6px] mb-6">
          {categories.map((category) => {
            const isSelected =
              (!category.categoryType && isFavoriteMode) ||
              (category.categoryType && selectedCategory === category.categoryType);

            return (
              <button
                key={category.categoryType || 'favorite'}
                onClick={() => handleCategoryClick(category.categoryType)}
                className={`
                  flex flex-col items-center justify-center gap-2 p-3 rounded-lg
                  transition-all
                  ${isSelected ? 'bg-primary-50 border border-primary' : 'bg-white text-gray-800 hover:bg-gray-100'}
                `}
              >
                <img src={category.image} alt={category.name} className="w-8 h-11" />
                <span className="text-label-m text-black">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* 나의 할 일 섹션 */}
        <div className="mb-6">
          <h2 className="text-label-m text-gray-500 mb-4">나의 할 일</h2>

          {todos.length > 0 ? (
            <div className="flex flex-col gap-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  {...todo}
                  onFavoriteChanged={fetchFavorites}
                  onClick={() => setEditDraftId(todo.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-display-xs text-black mb-2">추가된 할 일이 없어요</p>
              <p className="text-body-m-regular text-gray-600">할 일을 추가하고 일정을 계획해보세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 편집 바텀시트 */}
      {editDraftId && (
        <EditDraftFlowBottomSheet
          open={!!editDraftId}
          onClose={() => setEditDraftId(null)}
          draftId={editDraftId}
        />
      )}

      {/* 추가 바텀시트 */}
      {isBottomSheetOpen && (
        <AddTodoBottomSheet
          categoryType={selectedCategory ?? undefined}
          isFavoriteMode={isFavoriteMode}
          isOpen={isBottomSheetOpen}
          onClose={handleCloseBottomSheet}
        />
      )}

      <BottomCTAWrapper fixed showTopBorder>
        <BottomCTAButton label="캘린더에 추가하기" disabled={drafts.length === 0} onClick={handleSubmitToCalendar} />
      </BottomCTAWrapper>
    </div>
  );
}

export default AddTodoPage;
