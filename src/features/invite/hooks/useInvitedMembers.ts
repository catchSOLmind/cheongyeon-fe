import { useState, useEffect } from 'react';
import type { InvitedMember } from '../types/invite.types';

// 목업 데이터
const MOCK_MEMBERS: InvitedMember[] = [
  { id: '1', name: '카카오톡 닉네임1', tag: '방장', subtitle: '쓱싹이' },
  { id: '2', name: '카카오톡 닉네임2', subtitle: '쓱싹이' },
  { id: '3', name: '카카오톡 닉네임3', subtitle: '쓱싹이' },

];

export const useInvitedMembers = (houseId: string) => {
  const [members, setMembers] = useState<InvitedMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 로딩 시뮬레이션
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        
        // 네트워크 지연 시뮬레이션 (0.5초)
        //await new Promise(resolve => setTimeout(resolve, 500));
        
        // 목업 데이터 반환
        setMembers(MOCK_MEMBERS);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [houseId]);

  return { members, isLoading, error };
};