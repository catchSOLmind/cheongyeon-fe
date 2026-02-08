
// 테스트 결과값 ex.뽀득이 등을 서버에서 내려주는 타입값과 매핑
import type { ResultType } from "@/features/test/types/test.types"

export const TEST_RESULT_LABEL: Record<
  NonNullable<ResultType>,
  string
> = {
  PERFECTIONIST: '뽀득이',
  RELAXED: '느긋이',
  EFFICIENT: '효율이',
  PROCRASTINATOR: '내일이',
};


export const getTestResultLabel = (
  type: ResultType | null | undefined
): string | undefined => {
  if (!type) return undefined;
  return TEST_RESULT_LABEL[type];
};

// API에서 내려오는 testResultType을
// UI에서 사용하는 한글 라벨로 변환하는 유틸
//
// [ Usage ] 예시
//
// const ResultTypeLabel = getTestResultLabel(member.testResultType);
//
// return (
//   <>
//     {ResultTypeLabel && <Tag>{ResultTypeLabel}</Tag>}
//   </>
// );
//
// - 결과가 없으면 undefined 반환
// - 값이 있을 때만 화면에 표시하면 됨



