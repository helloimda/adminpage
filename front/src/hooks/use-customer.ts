import { useEffect, useState } from 'react';
import { getMembersByType, getRegisterMembers, getVisitedMembers } from '@/api/customers';

import type { MemberDateType } from '@/types/customer';

function useFetchMembersByType(
  fetchFunction: (type: MemberDateType) => Promise<Record<string, number>[]>,
  type: MemberDateType,
  errorMessage: string
): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  const [memberCount, setMemberCount] = useState<Record<string, number>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchMembers(): Promise<void> {
      try {
        const data = await fetchFunction(type);
        setMemberCount(data.reverse());
      } catch (err) {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void fetchMembers();
  }, [fetchFunction, type, errorMessage]);

  return { memberCount, loading, error };
}

export function useMembersCountByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  return useFetchMembersByType(getMembersByType, type, '총 회원 수를 가져오는 중 오류가 발생했습니다.');
}

export function useMembersVisitedByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  return useFetchMembersByType(getVisitedMembers, type, '방문자 수를 가져오는 중 오류가 발생했습니다.');
}

export function useMembersRegisterByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  return useFetchMembersByType(getRegisterMembers, type, '가입자 수를 가져오는 중 오류가 발생했습니다.');
}
