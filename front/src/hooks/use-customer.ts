import { useEffect, useState } from 'react';
import {
  deleteUser,
  getBenUserList,
  getGenderAge,
  getMembersByType,
  getRegisterMembers,
  getUserList,
  getVisitedMembers,
  postDoBen,
  postDoUnBen,
  searchIdBenUserList,
  searchIdUserList,
  searchNickBenUserList,
  searchNickUserList,
} from '@/api/customers';

import type {
  BenUser,
  DoBenResponse,
  DoUnBenResponse,
  GenderAgeData,
  MemberDateType,
  User,
  UserDeleteReponse,
} from '@/types/customer';

function useFetch<T, A1, A2>(
  fetchFunction: (arg1: A1, arg2: A2) => Promise<T>,
  errorMessage: string,
  arg1: A1,
  arg2: A2
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
        const result = await fetchFunction(arg1, arg2);
        setData(result);
      } catch (err) {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [fetchFunction, errorMessage, arg1, arg2]);

  return { data, loading, error };
}

export function useMembersCountByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  const { data, loading, error } = useFetch(
    getMembersByType,
    '총 회원 수를 가져오는 중 오류가 발생했습니다.',
    type,
    undefined
  );
  const reversedData = data ? [...data].reverse() : [];
  return { memberCount: reversedData || [], loading, error };
}

export function useMembersVisitedByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  const { data, loading, error } = useFetch(
    getVisitedMembers,
    '방문자 수를 가져오는 중 오류가 발생했습니다.',
    type,
    undefined
  );
  const reversedData = data ? [...data].reverse() : [];
  return { memberCount: reversedData || [], loading, error };
}

export function useMembersRegisterByType(type: MemberDateType): {
  memberCount: Record<string, number>[];
  loading: boolean;
  error: string;
} {
  const { data, loading, error } = useFetch(
    getRegisterMembers,
    '가입자 수를 가져오는 중 오류가 발생했습니다.',
    type,
    undefined
  );
  const reversedData = data ? [...data].reverse() : [];
  return { memberCount: reversedData || [], loading, error };
}

export function useFetchGenderAge(): {
  genderAgeData: GenderAgeData[] | null;
  loading: boolean;
  error: string;
} {
  const { data, loading, error } = useFetch(
    getGenderAge,
    '성별 및 연령 데이터를 가져오는 중 오류가 발생했습니다.',
    undefined,
    undefined
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
  const { data, loading, error } = useFetch(
    getBenUserList,
    '정지 유저 데이터를 가져오는 중 오류가 발생했습니다.',
    page,
    undefined
  );

  return {
    benUsers: data ? data.data : null,
    loading,
    error,
    previousPage: data?.pagination.previousPage || null,
    nextPage: data?.pagination.nextPage || null,
    currentPage: data?.pagination.currentPage || page,
    totalPages: data?.pagination.totalPages || 0,
  };
}

export function useFetchUserList(page: number): {
  users: User[] | null;
  loading: boolean;
  error: string;
  previousPage: number | null;
  nextPage: number | null;
  currentPage: number;
  totalPages: number;
} {
  const { data, loading, error } = useFetch(
    getUserList,
    '유저 데이터를 가져오는 중 오류가 발생했습니다.',
    page,
    undefined
  );

  return {
    users: data ? data.data : null,
    loading,
    error,
    previousPage: data?.pagination.previousPage || null,
    nextPage: data?.pagination.nextPage || null,
    currentPage: data?.pagination.currentPage || page,
    totalPages: data?.pagination.totalPages || 0,
  };
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

export function useDoBen(): {
  doBen: (memId: number, stopInfo: string, stopdf: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const doBen = async (memId: number, stopInfo: string, stopdf: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!stopInfo || !stopdf) {
        setError('정지 사유 미 입력 or  정지 기간 미 설정.');
        return;
      }
      const response: DoBenResponse = await postDoBen(memId, stopInfo, stopdf);
      setSuccess(response.success);

      if (!response.success) {
        setError(response.message || '정지 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('정지 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doBen, loading, error, success };
}

export function useFetchIdUserList(
  id: string,
  page?: number
): {
  users: User[] | null;
  loading: boolean;
  error: string;
  totalPages: number;
} {
  const currentPage = page || 1;

  const { data, loading, error } = useFetch(
    searchIdUserList,
    'ID로 유저를 검색하는 중 오류가 발생했습니다.',
    id,
    currentPage
  );

  if (!id) {
    return {
      users: null,
      loading: false,
      error: '',
      totalPages: 0,
    };
  }

  return {
    users: data ? data.data : null,
    loading,
    error,
    totalPages: data?.pagination?.totalPages || 0,
  };
}

export function useFetchIdBenUserList(
  id: string,
  page?: number
): {
  benUsers: BenUser[] | null;
  loading: boolean;
  error: string;
  totalPages: number;
} {
  const currentPage = page || 1;

  const { data, loading, error } = useFetch(
    searchIdBenUserList,
    'ID로 유저를 검색하는 중 오류가 발생했습니다.',
    id,
    currentPage
  );

  if (!id) {
    return {
      benUsers: null,
      loading: false,
      error: '',
      totalPages: 0,
    };
  }

  return {
    benUsers: data ? data.data : null,
    loading,
    error,
    totalPages: data?.pagination?.totalPages || 0,
  };
}

export function useFetchNickUserList(
  nick: string,
  page?: number
): {
  users: User[] | null;
  loading: boolean;
  error: string;
  totalPages: number;
} {
  const currentPage = page || 1;

  const { data, loading, error } = useFetch(
    searchNickUserList,
    '닉네임으로 유저를 검색하는 중 오류가 발생했습니다.',
    nick,
    currentPage
  );

  return {
    users: data ? data.data : null,
    loading,
    error,
    totalPages: data?.pagination?.totalPages || 0,
  };
}

export function useFetchNickBenUserList(
  nick: string,
  page?: number
): {
  benUsers: BenUser[] | null;
  loading: boolean;
  error: string;
  totalPages: number;
} {
  const currentPage = page || 1;

  const { data, loading, error } = useFetch(
    searchNickBenUserList,
    '닉네임으로 유저를 검색하는 중 오류가 발생했습니다.',
    nick,
    currentPage
  );

  return {
    benUsers: data ? data.data : null,
    loading,
    error,
    totalPages: data?.pagination?.totalPages || 0,
  };
}

export function useDeleteUser(): {
  doDeleteUser: (memIdx: number) => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doDeleteUser = async (memIdx: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: UserDeleteReponse = await deleteUser(memIdx);

      if (response.message !== '회원이 성공적으로 삭제되었습니다.') {
        setError(response.message || '사용자 삭제 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('사용자 삭제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doDeleteUser, loading, error };
}
