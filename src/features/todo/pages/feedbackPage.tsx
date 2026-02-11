// features/todo/pages/FeedbackPage.tsx
import { useEffect, useMemo, useState } from 'react';
import Header from '@/shared/components/Header';

import MemberChoiceItem from '../components/feedback/MemberChoiceItem';
import DropdownSelect from '../components/feedback/DropdownSelect';
import FeedbackField from '../components/feedback/FeedbackField';

import { useFeedbackFields } from '../hooks/useFeedbackFields';
import { complimentStickers } from '../data/feedbackStamps';
import { BottomCTAWrapper } from '@/shared/components/BottomCTAWrapper';
import { BottomCTAButton } from '@/shared/components/BottomCTAButton';
import { getFeedbackTemplate } from '../api/feedbackApi';
import type { GroupMember } from '../types/feedback.types';
import { getTestResultLabel } from '@/shared/utils/getTestResultLabel';

import type { CategoryType } from '../types/category.types';
import { categories as categoryOptions } from '../data/categoryTypeImages';

import { postRefineFeedback } from '@/features/todo/api/feedbackApi';
// import { postSubmitFeedback } from '../api/feedbackSubmitApi'; // 최종 제출 API (나중에 연결)

type Phase = 'editing' | 'refined';

function FeedbackPage() {
  const maxLength = 100;
  const maxFeedbackCount = 5;

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsLoading] = useState(true);

  // =========================
  // 멤버 선택
  // =========================
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);

  // =========================
  // 칭찬 스티커 선택
  // =========================
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);

  // =========================
  // 피드백 필드 훅 (CategoryType 버전)
  // =========================
  const {
    feedbacks,
    canAdd,
    addFeedback,
    toggleCategoryDropdown,
    selectCategory,
    changeText,
  } = useFeedbackFields({
    maxFeedbackCount,
    initialCount: 1,
    maxLength,
  });

  // =========================
  // AI 정제 플로우 상태
  // =========================
  const [phase, setPhase] = useState<Phase>('editing');
  const [isRefining, setIsRefining] = useState(false);

  // id별 원문 저장 (되돌리기용)
  const [originalTextsById, setOriginalTextsById] = useState<Record<string, string>>({});
  // id별 정제 여부 (하늘색 표시 + 되돌리기 박스 표시)
  const [refinedById, setRefinedById] = useState<Record<string, boolean>>({});
  // id별 로딩 여부 (해당 textarea 아래 로딩 박스 표시)
  const [refiningById, setRefiningById] = useState<Record<string, boolean>>({});

  // =========================
  // 초기 데이터 로드 (템플릿)
  // =========================
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getFeedbackTemplate();
        setGroupMembers(res.result?.groupMembers ?? []);
      } catch (e) {
        console.error('피드백 템플릿 로드 실패', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, [setIsLoading]);

  // 피드백 받는 멤버
  const selectedMemberData = groupMembers.find(
    (m) => m.groupMemberId === selectedMember
  );

  const handleMemberSelect = (memberId: number) => {
    setSelectedMember(memberId);
    setIsMemberDropdownOpen(false);
  };

  const handleStickerClick = (stickerId: string) => {
    setSelectedStickers((prev) =>
      prev.includes(stickerId)
        ? prev.filter((id) => id !== stickerId)
        : [...prev, stickerId]
    );
  };

  // 카테고리 이름 표시용
  const getCategoryName = (categoryType?: CategoryType | null) =>
    categoryOptions.find((c) => c.categoryType === categoryType)?.name;

  // =========================
  // AI 다듬기 요청 payload (순서 보장)
  // - 빈 텍스트는 제외
  // - ids와 contents는 같은 순서
  // =========================
  const contentsPayload = useMemo(() => {
    const targets = feedbacks
      .map((f) => ({ id: f.id, text: f.text.trim() }))
      .filter((x) => x.text.length > 0);

    return {
      ids: targets.map((t) => t.id),
      contents: targets.map((t) => t.text),
    };
  }, [feedbacks]);

  // =========================
  // 1) 피드백 작성 완료(= AI 다듬기)
  // =========================
  const handleRefine = async () => {
    if (isRefining) return;

    const { ids, contents } = contentsPayload;
    if (contents.length === 0) return;

    try {
      setIsRefining(true);

      // 대상 필드 로딩 ON
      setRefiningById((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = true;
        });
        return next;
      });

      // 되돌리기용 원문 저장 (이번 대상만)
      setOriginalTextsById((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          const item = feedbacks.find((f) => f.id === id);
          next[id] = item?.text ?? '';
        });
        return next;
      });

      const res = await postRefineFeedback({ contents });
      if (!res.isSuccess) return;

      const refined = res.result.refinedContents ?? [];

      // 응답 순서 = 요청 순서 (ids 순서와 동일)
      ids.forEach((id, i) => {
        changeText(id, refined[i] ?? '');
      });

      // 정제 완료 표시 ON (하늘색 + 되돌리기 박스)
      setRefinedById((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = true;
        });
        return next;
      });

      setPhase('refined');
    } catch (e) {
      console.error('AI 다듬기 실패', e);
    } finally {
      // 대상 필드 로딩 OFF
      setRefiningById((prev) => {
        const next = { ...prev };
        contentsPayload.ids.forEach((id) => {
          delete next[id];
        });
        return next;
      });

      setIsRefining(false);
    }
  };

  // =========================
  // 2) 개별 되돌리기 (필드별)
  // =========================
  const handleRollbackOne = (id: string) => {
    const original = originalTextsById[id];
    if (typeof original !== 'string') return;

    // 텍스트 되돌리기
    changeText(id, original);

    // 정제 표시 제거
    setRefinedById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    // 원문도 제거(원하면 유지 가능)
    setOriginalTextsById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // 정제된 항목이 하나라도 남아있는지
  const hasAnyRefined = useMemo(
    () => Object.keys(refinedById).length > 0,
    [refinedById]
  );

  // 정제된 항목이 없으면 editing으로
  useEffect(() => {
    if (!hasAnyRefined) setPhase('editing');
  }, [hasAnyRefined]);

  // =========================
  // 3) 최종 제출
  // =========================
  const handleSubmit = async () => {
    if (phase !== 'refined') return;

    // TODO: 최종 제출 API 연결
    // await postSubmitFeedback({ ... })

    console.log('최종 제출 payload', {
      selectedMember,
      selectedStickers,
      feedbacks,
    });
  };

  // CTA 활성 조건
  const canRefine =
    !!selectedMember &&
    (selectedStickers.length > 0 ||
      feedbacks.some((f) => f.text.trim().length > 0));

  const canSubmit = phase === 'refined' && !!selectedMember;

  return (
    <div className="min-h-screen bg-white">
      <Header title="피드백 남기기" showBackButton />

      <div className="px-5 py-5">
        {/* =========================
         * 피드백 받는 사람
         * ========================= */}
        <div className="mb-9">
          <label className="block text-body-l-bold text-black mb-4">
            받는 사람
          </label>

          <DropdownSelect
            isOpen={isMemberDropdownOpen}
            onToggle={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
            selectedValue={selectedMember}
            placeholder="멤버를 선택해주세요"
            displayValue={selectedMemberData?.nickname ?? undefined}
            showProfile={true}
            selectedImage={selectedMemberData?.profileImageUrl ?? undefined}
            showTag={
              selectedMemberData?.testResultType
                ? getTestResultLabel(selectedMemberData.testResultType)
                : undefined
            }
          >
            {groupMembers.map((m) => (
              <MemberChoiceItem
                key={m.groupMemberId}
                groupMemberId={m.groupMemberId}
                nickname={m.nickname}
                profileImageUrl={m.profileImageUrl ?? undefined}
                testResultTypeLabel={getTestResultLabel(m.testResultType)}
                isSelected={selectedMember === m.groupMemberId}
                onClick={() => handleMemberSelect(m.groupMemberId)}
              />
            ))}
          </DropdownSelect>
        </div>

        {/* =========================
         * 칭찬 스티커
         * ========================= */}
        <div className="mb-9">
          <label className="block text-body-l-bold text-black mb-2.5">
            칭찬 스티커
          </label>

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
                      src={
                        selectedStickers.includes(sticker.id)
                          ? sticker.iconFill
                          : sticker.icon
                      }
                      alt={sticker.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className={`text-label-l whitespace-pre-line text-center ${
                      selectedStickers.includes(sticker.id)
                        ? 'text-gray-800'
                        : 'text-semantic-notify'
                    }`}
                  >
                    {sticker.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* =========================
         * 개선 피드백
         * ========================= */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-body-l-bold text-black">
              개선 피드백
            </label>
            <span className="px-2 py-1 bg-semantic-badge text-white text-label-m rounded-lg">
              AI 매니저
            </span>
          </div>

          <p className="text-body-m text-gray-800 mb-4">
            자유롭게 작성하면 AI가 정돈해서 전달합니다.
          </p>

          {/* FeedbackField 반복 렌더 */}
          {feedbacks.map((f) => (
            <FeedbackField
              key={f.id}
              labelId={f.id}
              value={f.text}
              maxLength={maxLength}
              categoryType={f.categoryType ?? undefined}
              categoryName={getCategoryName(f.categoryType) ?? undefined}
              isDropdownOpen={f.isDropdownOpen}
              onToggleDropdown={() => toggleCategoryDropdown(f.id)}
              onSelectCategory={(category) => selectCategory(f.id, category)}
              onChangeText={(text) => changeText(f.id, text)}
              // 하늘색 채우기 + 개별 되돌리기 + textarea 아래 박스
              isRefined={!!refinedById[f.id]}
              isRefiningThis={!!refiningById[f.id]}
              showAiBox={!!refiningById[f.id] || !!refinedById[f.id]}
              onRollback={() => handleRollbackOne(f.id)}
            />
          ))}

          {/* 작성 완료 후에는 추가 버튼 숨김 */}
          {phase === 'editing' && (
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
          )}
        </div>
      </div>

      {/* =========================
       * Bottom CTA: phase에 따라 버튼이 바뀜
       * ========================= */}
      <BottomCTAWrapper>
        {phase === 'editing' ? (
          <BottomCTAButton
            label="피드백 작성완료"
            disabled={!canRefine || isRefining}
            onClick={handleRefine}
          />
        ) : (
          <BottomCTAButton
            label="피드백 제출하기"
            disabled={!canSubmit || isRefining}
            onClick={handleSubmit}
          />
        )}
      </BottomCTAWrapper>
    </div>
  );
}

export default FeedbackPage;
