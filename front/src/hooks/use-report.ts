'use client';

import { useEffect, useState } from 'react';
import { getBoardReportCount, getBoardReportList, getMemberReportCount, getMemberReportList } from '@/api/report';

import type {
  BoardReportCountResponse,
  BoardReportListResponse,
  MemberReportCountResponse,
  MemberReportListResponse,
} from '@/types/board/report';

function useFetch<T, A1>(
  fetchFunction: (arg1: A1) => Promise<T>,
  errorMessage: string,
  arg1: A1
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
        const result = await fetchFunction(arg1);
        setData(result);
      } catch (err) {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [fetchFunction, errorMessage, arg1]);

  return { data, loading, error };
}

// 게시글 신고 리스트 가져오기 훅
export function useBoardReportList(page = 1): {
  data: BoardReportListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getBoardReportList, '게시글 신고 리스트를 가져오는 중 오류가 발생했습니다.', page);
}

// 게시글 신고 카운트 가져오기 훅
export function useBoardReportCount(): {
  data: BoardReportCountResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getBoardReportCount, '게시글 신고 카운트를 가져오는 중 오류가 발생했습니다.', undefined);
}

// 유저 신고 리스트 가져오기 훅
export function useMemberReportList(page = 1): {
  data: MemberReportListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getMemberReportList, '유저 신고 리스트를 가져오는 중 오류가 발생했습니다.', page);
}

// 유저 신고 카운트 가져오기 훅
export function useMemberReportCount(): {
  data: MemberReportCountResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getMemberReportCount, '유저 신고 카운트를 가져오는 중 오류가 발생했습니다.', undefined);
}
