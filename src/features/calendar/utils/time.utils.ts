
// 시간을 받아와서 오전/오후 00:00 형식으로 반환하는 유틸
export const formatTime = (time?: string | null): string => {
  if (!time) return '';

  const [hoursStr, minutesStr = '00'] = time.split(':');
  const hour = Number(hoursStr);

  if (Number.isNaN(hour)) return '';

  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${displayHour}:${minutesStr.padStart(2, '0')}`;
};
