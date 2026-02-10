// src/shared/utils/formatDateKR.ts
// 서버 시간을 년월일로 변환해서 보여주는 함수 
export const formatDateKR = (isoString: string) => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-based
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};
