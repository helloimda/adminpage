import { useEffect, useState } from 'react';
import { getMembersByType, getTotalMembers } from '@/api/customers';

import type { MemberDateType } from '@/types/customer';

export function useTotalMembers(): {
  totalMembers: number;
  loading: boolean;
  error: string;
} {
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchTotalMembers(): Promise<void> {
      try {
        const total = await getTotalMembers();
        setTotalMembers(total);
      } catch (err) {
        setError('총 멤버 수를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    void fetchTotalMembers();
  }, []);

  return { totalMembers: totalMembers ?? 0, loading, error };
}

export function useMembersCountByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  const [memberCount, setMemberCount] = useState<Record<string, number>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchMembersByType(): Promise<void> {
      try {
        const data = await getMembersByType(type);
        setMemberCount(data);
      } catch (err) {
        setError('멤버 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    void fetchMembersByType();
  }, [type]);

  return { memberCount, loading, error };
}
