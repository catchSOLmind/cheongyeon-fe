
import DotImg from '@/assets/test/icon-dot.svg';


export type ResultType =
  | 'PERFECTIONIST'
  | 'RELAXED'
  | 'EFFICIENT'
  | 'PROCRASTINATOR';


export type RecommendItem = {
  id: string;
  icon: string; 
  label: string;
};

type RecommendCardProps = {
  resultType: ResultType;
};

const RECOMMEND_WORKS: Record<
  ResultType,
  { items: RecommendItem[]; description: string; }
> = {
PERFECTIONIST: {
    items: [
      { id: '1', icon: '🥘', label: '주방 후드 청소' },
      { id: '2', icon: '🧹', label: '냉장고 정리' },
      { id: '3', icon: '🚽', label: '변기 청소' },
    ],
    description: '디테일과 완벽함이 필요한 업무를 잘해요',
},
  RELAXED: {
    items: [
      { id: '1', icon: '️🌅', label: '이불 햇볕 건조' },
      { id: '2', icon: '🛏️', label: '침구 교체' },
      { id: '3', icon: '🧹', label: '선반 먼지 닦기' },
    ],
    description: '긴 시간이 걸려도 나만의 리듬으로 꼼꼼하게 완수해요',
  },
  EFFICIENT: {
    items: [
      { id: '1', icon: '👕', label: '세탁기 돌리기' },
      { id: '2', icon: '🫧', label: '설거지 하기' },
      { id: '3', icon: '🧹', label: '청소기 돌리기' },
    ],
    description: '시간 효율을 챙기는 멀티태스킹을 잘해요',
  },
    PROCRASTINATOR: {   
    items: [
      { id: '1', icon: '🥘', label: '음식물 버리기' },
      { id: '2', icon: '🗑️', label: '분리수거' },
      { id: '3', icon: '🚿', label: '하수구 관리' },
    ],
    description: '미루지 않고 바로 처리할 수 있도록 환경을 마련해요',
  },
};



export default function RecommendCard(props: RecommendCardProps) {
  const { resultType } = props;
  const { items, description } = RECOMMEND_WORKS[resultType];

  return (
    <section className="bg-white px-5 py-10 text-center">
      <h2 className="text-display-xs text-black">추천 가사업무</h2>
      <p className="mt-5 text-body-m text-gray-600">{description}</p>


    <div className="relative mt-5 grid grid-cols-3">
    {items.map((item) => (
    <div key={item.id} className="flex flex-col items-center">
      <div className="text-display-m leading-none">{item.icon}</div>
    <div className="mt-[6px] whitespace-nowrap text-body-m-bold text-primary-900">
    {item.label}
    </div>
    </div>
  ))}

  {/* 구분자(점 이미지) 2개: 1/3, 2/3 지점 */}
  <img
    src={DotImg}
    alt=""
    className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 h-1 w-1"
    aria-hidden="true"
  />
  <img
    src={DotImg}
    alt=""
    className="absolute left-2/3 top-1/2 -translate-y-1/2 -translate-x-1/2 h-1 w-1"
    aria-hidden="true"
  />
</div>
    </section>
  );
}
