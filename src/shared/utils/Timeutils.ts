// ---------- 한국시간 타입 ----------
export type TimeValue = {
  ampm: '오전' | '오후';
  hour: number;
  minute: number;
};

// ---------- 유틸 함수 ----------
export function formatKoreanTime(t: TimeValue) {
  const hh = String(t.hour).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${t.ampm} ${hh}:${mm}`;
}

export function parseHHmmToKorean(time?: string | null): TimeValue {
  if (!time) return { ampm: '오전', hour: 12, minute: 0 };
  const [hh, mm] = time.split(':').map(Number);
  const ampm: '오전' | '오후' = hh >= 12 ? '오후' : '오전';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return { ampm, hour: hour12, minute: mm };
}

export function toHHmm(t: TimeValue) {
  let h = t.hour % 12;
  if (t.ampm === '오후') h += 12;
  if (t.ampm === '오전' && t.hour === 12) h = 0;
  const hh = String(h).padStart(2, '0');
  const mm = String(t.minute).padStart(2, '0');
  return `${hh}:${mm}`;
}