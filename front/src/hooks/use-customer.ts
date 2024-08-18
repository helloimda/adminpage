import { useEffect, useState } from 'react';
import {
  getBenUserList,
  getGenderAge,
  getMembersByType,
  getRegisterMembers,
  getVisitedMembers,
  postDoUnBen,
} from '@/api/customers';

import type { BenUser, DoUnBenResponse, GenderAgeData, MemberDateType } from '@/types/customer';

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

function useFetchData<T>(
  fetchFunction: () => Promise<T>,
  errorMessage: string
): {
  data: T | null;
  loading: boolean;
  error: string;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [fetchFunction, errorMessage]);

  return { data, loading, error };
}

export function useFetchGenderAge(): {
  genderAgeData: GenderAgeData[] | null;
  loading: boolean;
  error: string;
} {
  const { data, loading, error } = useFetchData<GenderAgeData[]>(
    getGenderAge,
    '성별 및 연령 데이터를 가져오는 중 오류가 발생했습니다.'
  );

  return { genderAgeData: data, loading, error };
}

export function useFetchBenList(page: number): {
  benUsers: BenUser[] | null;
  loading: boolean;
  error: string;
  previousPage: number | null;
  nextPage: number | null;
  currentPage: number;
  totalPages: number;
} {
  const [benUsers, setBenUsers] = useState<BenUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [previousPage, setPreviousPage] = useState<number | null>(null);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    async function fetchBenUsers(): Promise<void> {
      try {
        setLoading(true);
        const response = await getBenUserList(page);

        setBenUsers(response.data);
        setPreviousPage(response.pagination.previousPage);
        setNextPage(response.pagination.nextPage);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setError('');
      } catch (err) {
        setError('정지 유저 데이터를 가져오는 중 오류가 발생했습니다.');
        setBenUsers(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchBenUsers();
  }, [page]);

  return { benUsers, loading, error, previousPage, nextPage, currentPage, totalPages };
}

export function useDoUnBen(): {
  doUnBen: (memId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const doUnBen = async (memId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response: DoUnBenResponse = await postDoUnBen(memId);
      setSuccess(response.success);

      if (!response.success) {
        setError(response.message || '정지 해제 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('정지 해제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doUnBen, loading, error, success };
}
