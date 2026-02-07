import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useState } from 'react';
import IconCoin from '@/assets/todo/icon-coin.svg';
import IconCalendar from '@/assets/todo/icon-calendar.svg';
import IconClock from '@/assets/todo/icon-clock.svg';
import IconStar from '@/assets/todo/icon-star.svg';
import IconStarFill from '@/assets/todo/icon-star-fill.svg';
import { categories } from '../data/categoryTypeImages';
import type { CategoryType } from '../types/category.types';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import { useTaskDraftStore } from '../stores/useTaskDraftStore';
import { deleteFavorite, postFavorite } from '../api/favoriteApi';
import ImgDefault from '@/assets/common/img-default-profile.svg';
import IconTrash from '@/assets/todo/icon-trash.svg';

interface TodoItemProps {
  categoryType: CategoryType;
  taskTypeId: number;
  id: string;
  title: string;
  date: string;
  time: string;
  points: number;
  assignee: {
    name: string;
    avatar?: string;
  };
  tag?: string;
  isFavorite: boolean;
  isCompleted: boolean;
}

const DELETE_BUTTON_WIDTH = 80; // 삭제 버튼 너비
const SNAP_THRESHOLD = DELETE_BUTTON_WIDTH / 2; // Snapping 임계값

export function TodoItem({
  categoryType,
  taskTypeId,
  title,
  date,
  time,
  points,
  //assignee,
  tag,
  isFavorite,
}: TodoItemProps) {
  const category = categories.find((c) => c.categoryType === categoryType);
  const categoryIcon = category?.image;
  const avatarUrl = useUserStore((s) => s.profile?.profileImageUrl);
  const removeDraft = useTaskDraftStore((s) => s.removeDraft);
  const toggleFavoriteByTaskTypeId = useTaskDraftStore((s) => s.toggleFavoriteByTaskTypeId);
  const hasTag = Boolean(tag?.trim());

  const [isDeleting, setIsDeleting] = useState(false);
  
  const x = useMotionValue(0);
  
  // 배경 opacity: 드래그 양에 비례
  const deleteButtonOpacity = useTransform(
    x,
    [-DELETE_BUTTON_WIDTH, 0],
    [1, 0]
  );
  
  // 삭제 버튼 텍스트/아이콘 scale
  const deleteButtonScale = useTransform(
    x,
    [-DELETE_BUTTON_WIDTH, -SNAP_THRESHOLD, 0],
    [1, 0.8, 0]
  );

  const handleClickFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isFavorite;
    try {
      if (next) await postFavorite(taskTypeId);
      else await deleteFavorite(taskTypeId);
      toggleFavoriteByTaskTypeId(taskTypeId, next);
    } catch{
     alert('즐겨찾기 변경 실패');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // 제자리로 돌아가는 애니메이션
    await new Promise(resolve => {
      x.set(0);
      setTimeout(resolve, 200);
    });
    
    // Fade out
    setTimeout(() => {
      removeDraft(String(taskTypeId));
    }, 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    
    // 왼쪽으로 드래그한 경우만 처리
    if (offset < 0) {
      // SNAP_THRESHOLD를 넘었으면 삭제 버튼까지 스냅
      if (Math.abs(offset) > SNAP_THRESHOLD) {
        x.set(-DELETE_BUTTON_WIDTH);
      } else {
        // 못 넘었으면 원점으로
        x.set(0);
      }
    } else {
      // 오른쪽으로 드래그하면 무조건 원점
      x.set(0);
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg"
      initial={{ opacity: 1, height: 'auto' }}
      animate={
        isDeleting
          ? { opacity: 0, height: 0, marginBottom: 0 }
          : { opacity: 1, height: 'auto' }
      }
      transition={{ duration: 0.3 }}
    >
      {/* 삭제 버튼 배경 */}
      <motion.div
        className="absolute right-0 top-0 h-full flex items-center justify-center bg-red-500"
        style={{
          width: DELETE_BUTTON_WIDTH,
          opacity: deleteButtonOpacity,
        }}
      >
        <motion.button
          onClick={handleDelete}
          className="flex items-center justify-center w-full h-full"
          style={{ scale: deleteButtonScale }}
        >
          <img src={IconTrash} alt="삭제" className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* 메인 컨텐츠 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -DELETE_BUTTON_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="bg-white rounded-lg p-4 cursor-grab active:cursor-grabbing relative z-10"
      >
        <div className="flex items-center gap-3">
          {/* 카테고리 */}
          <div className="w-8 h-8 bg-primary-50 rounded-md flex items-center justify-center flex-shrink-0">
            {categoryIcon && (
              <img
                src={categoryIcon}
                alt={category?.name || '카테고리'}
                className="w-6 h-6"
              />
            )}
          </div>

          {/* 오른쪽: 내용 */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 제목 */}
            <h3 className="text-body-m-bold text-black truncate">{title}</h3>

            {/* 날짜/시간 + 즐겨찾기 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center gap-1.5">
                  <img src={IconCalendar} alt="날짜" className="w-5 h-5" />
                  <span className="text-body-s text-gray-600">{date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <img src={IconClock} alt="시간" className="w-5 h-5" />
                  <span className="text-body-s text-gray-600">{time}</span>
                </div>
              </div>

              <button
                className="flex-shrink-0"
                onClick={handleClickFavorite}
                type="button"
              >
                <img
                  src={isFavorite ? IconStarFill : IconStar}
                  alt="즐겨찾기"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* 포인트 + 태그 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <img src={IconCoin} alt="포인트" className="w-5 h-5" />
                <span className="text-body-s text-gray-600">{points} 포인트</span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                {/* 내 프로필 사진 */}
                <img
                  src={avatarUrl || ImgDefault}
                  alt="내 프로필"
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />

                {/* 반복 요일 태그 */}
                {hasTag && (
                  <span className="px-2 py-0.5 bg-primary-50 text-[#424B4C] rounded-full text-body-s whitespace-nowrap">
                    {tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}