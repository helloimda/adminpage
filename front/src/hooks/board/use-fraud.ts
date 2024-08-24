import React, { useEffect, useState } from 'react';
import {
  deleteFraudBoard,
  getFraudBoardDetail,
  getFraudBoardList,
  searchFraudBoardByGoodName,
  searchFraudBoardByNick,
} from '@/api/board/fraud';

import type {
  DeleteFraudBoardResponse,
  FraudBoardDetailResponse,
  FraudBoardListResponse,
  FraudSearchType,
} from '@/types/board/fraud';

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

// 사기게시글 목록 가져오기 훅
export function useFraudBoardList(page = 1): {
  data: FraudBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getFraudBoardList, '사기게시글 목록을 가져오는 중 오류가 발생했습니다.', page, undefined);
}

// 사기게시글 삭제 훅
export function useDeleteFraudBoard(): {
  doDeleteFraudBoard: (bofIdx: number) => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doDeleteFraudBoard = async (bofIdx: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: DeleteFraudBoardResponse = await deleteFraudBoard(bofIdx);

      if (response.message !== '사기 피해 게시글이 성공적으로 삭제되었습니다.') {
        setError(response.message || '게시글 삭제 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('게시글 삭제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doDeleteFraudBoard, loading, error };
}

// 거래물품명으로 사기게시글 검색 훅
export function useSearchFraudBoardByGoodName(
  id: string,
  page = 1
): {
  data: FraudBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchFraudBoardByGoodName, '거래물품명으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 닉네임으로 사기게시글 검색 훅
export function useSearchFraudBoardByNick(
  id: string,
  page = 1
): {
  data: FraudBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchFraudBoardByNick, '닉네임으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 사기게시글 상세 조회 훅
export function useFraudBoardDetail(bofIdx: number): {
  data: FraudBoardDetailResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getFraudBoardDetail, '사기게시글 세부 정보를 가져오는 중 오류가 발생했습니다.', bofIdx, undefined);
}

// 사기게시글 데이터 가져오기 훅
export function useFetchFraudBoardData(
  searchQuery: string,
  searchType: FraudSearchType,
  currentPage: number
): {
  data: FraudBoardListResponse | null;
  loading: boolean;
  error: string;
  setData: React.Dispatch<React.SetStateAction<FraudBoardListResponse | null>>;
} {
  const [data, setData] = useState<FraudBoardListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchData = async (): Promise<void> => {
      try {
        let result: FraudBoardListResponse | null = null;
        if (searchType && searchQuery) {
          switch (searchType) {
            case 'goodname':
              result = await searchFraudBoardByGoodName(searchQuery, currentPage);
              break;
            case 'nick':
              result = await searchFraudBoardByNick(searchQuery, currentPage);
              break;
            default:
              break;
          }
        } else {
          result = await getFraudBoardList(currentPage);
        }
        setData(result);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [searchQuery, searchType, currentPage]);

  return { data, loading, error, setData };
}
