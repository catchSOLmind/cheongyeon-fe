// src/components/Steppers.tsx
type Step = 1 | 2 | 3;

interface SteppersProps {
  step: Step;
}

export default function Steppers({ step }: SteppersProps) {
  const steps: Array<{ id: Step; label: string }> = [
    { id: 1, label: '멤버 초대' },
    { id: 2, label: '협약서 작성' },
    { id: 3, label: '협약서 완성' },
  ];

  // 원(w-5=20px) 중심 보정값
  const endOffset = 18; // px

  // 1 -> 0%, 2 -> 50%, 3 -> 100%
  const progressScale =
    step === 1 ? 'scale-x-0' : step === 2 ? 'scale-x-50' : 'scale-x-100';

  return (
    <div className="mx-auto w-full max-w-[390px] px-6 pt-6 pb-10">
      <div className="relative w-full">
        {/* 회색 선: 끝점이 원 중심에서 끝나게 */}
        <div
          className="absolute top-[10px] h-[1px] bg-gray-300"
          style={{ left: endOffset, right: endOffset }}
        />

        {/* 파란 진행 선: 회색 선과 동일 범위 + scale로 채우기 */}
        <div
          className={[
            'absolute top-[10px] h-[1px] bg-primary-500 origin-left',
            progressScale,
          ].join(' ')}
          style={{ left: endOffset, right: endOffset }}
        />

        {/* 원 + 라벨 */}
        <div className="flex items-start justify-between">
          {steps.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={[
                    'relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-body-s',
                    isActive || isCompleted
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-300',
                  ].join(' ')}
                >
                  {s.id}
                </div>

                <div
                  className={[
                    'mt-[6px] text-body-s leading-none',
                    isActive ? 'text-primary-600' : 'text-gray-300',
                  ].join(' ')}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
