// src/features/agreement/components/AgreementFeedbackBottomSheet.tsx
import { useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/BottomSheet';
import ImgCheongyeon from '@/assets/common/img-default-profile.svg'
import ImgHeart from '@/assets/agreement/icon-heart.png';

type FeedbackItem = {
  id: number;
  authorName: string;
  authorRole?: '대표자' | '멤버';
  avatarUrl?: string | null;
  createdAtLabel: string; // ex) "2시간 전"
  content: string;
  liked?: boolean;
};

interface AgreementFeedbackBottomSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function AgreementFeedbackBottomSheet({
  open,
  onClose,
}: AgreementFeedbackBottomSheetProps) {
  const maxLen = 100;

  // 샘플 피드백
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    {
      id: 1,
      authorName: '김청연',
      authorRole: '멤버',
      avatarUrl: ImgCheongyeon,
      createdAtLabel: '2시간 전',
      content:
        '예시) 규칙 1번에 "빨래 뒤집어서 놓지 않기"는 다같이 노력해보자! 화이팅!',
      liked: false,
    },
  ]);

  const [text, setText] = useState('');

  const countLabel = useMemo(() => `${text.length}/${maxLen}`, [text.length]);

  const canSend = text.trim().length > 0 && text.length <= maxLen;

  const handleSend = () => {
    if (!canSend) return;

    // 하드코딩 추가
    const newItem: FeedbackItem = {
      id: Date.now(),
      authorName: '익명의 멤버',
      authorRole: '멤버',
      avatarUrl: null,
      createdAtLabel: '방금 전',
      content: text.trim(),
      liked: false,
    };

    setFeedbackList((prev) => [newItem, ...prev]);
    setText('');
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="협약서 피드백"
      height="80vh"
      contentClassName="px-5 pb-6 pt-4"
    >
      {/* 작성 */}
      <section>
        <h3 className="mt-6 text-body-l-bold text-black">피드백 작성하기</h3>

        <div className="mt-3 rounded-xl border border-gray-300 bg-white px-3 py-3">
          <textarea
            value={text}
            onChange={(e) => {
              const v = e.target.value;
              if (v.length > maxLen) return;
              setText(v);
            }}
            placeholder="피드백을 작성해주세요"
            className="w-full min-h-[120px] resize-none bg-transparent text-body-m text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-body-s text-gray-400">{countLabel}</p>

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={[
                'h-8 w-10 flex items-center justify-end',
                canSend ? 'text-primary-500' : 'text-gray-300',
              ].join(' ')}
              aria-label="피드백 전송"
            >
              {/* paper plane icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 목록 */}
      <section className="mt-8">
        <h3 className="mt-6 text-body-l-bold text-black">피드백 목록</h3>

        {/* 빈 상태 */}
        {feedbackList.length === 0 ? (
          <div className="mt-6 text-center text-body-m text-gray-400">
            아직 피드백이 없어요.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-gray-50 px-4 py-4"
              >
                {/* 상단 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={`${item.authorName} avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img src={ImgCheongyeon} className='w-6 h-6'/>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-body-s-bold text-gray-800">
                          {item.authorName}
                        </span>
                        {item.authorRole && (
                          <span className="text-body-s text-gray-400">
                            ({item.authorRole})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-body-s text-gray-400">
                    {item.createdAtLabel}
                  </span>
                </div>
                {/* 본문 */}
                <p className="mt-3 text-body-m text-gray-700 whitespace-pre-wrap">
                  {item.content}
                </p>

                {/* 좋아요 */}
                <div className="mt-3">
                  <img src={ImgHeart} className='w-9 h-7'/>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </BottomSheet>
  );
}
