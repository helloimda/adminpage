'use client';

import React, { useEffect, useState } from 'react';
import {
  deleteLimitedSales,
  getLimitedSalesDetail,
  getLimitedSalesList,
  searchLimitedSalesByMember,
  searchLimitedSalesByName,
} from '@/api/board/limited';

import type {
  DeleteLimitedSalesResponse,
  LimitedSalesDetailResponse,
  LimitedSalesListResponse,
  LimitedSalesSearchType,
} from '@/types/board/limited';

// 공통 useFetch 훅
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

// 한정판매 리스트 가져오기 훅
export function useLimitedSalesList(page = 1): {
  data: LimitedSalesListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getLimitedSalesList, '한정판매 리스트를 가져오는 중 오류가 발생했습니다.', page, undefined);
}

// 한정판매 상세 정보 가져오기 훅
export function useLimitedSalesDetail(gdIdx: number): {
  data: LimitedSalesDetailResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getLimitedSalesDetail, '한정판매 상품 정보를 가져오는 중 오류가 발생했습니다.', gdIdx, undefined);
}

// 한정판매 상품 삭제 훅
export function useDeleteLimitedSales(): {
  doDeleteSales: (gdIdx: number) => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doDeleteSales = async (gdIdx: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: DeleteLimitedSalesResponse = await deleteLimitedSales(gdIdx);

      if (response.message !== '상품이 성공적으로 삭제되었습니다.') {
        setError(response.message || '상품 삭제 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('상품 삭제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doDeleteSales, loading, error };
}

// 상품명으로 한정판매 게시글 검색 훅
export function useSearchLimitedSalesByName(
  gdName: string,
  page = 1
): {
  data: LimitedSalesListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchLimitedSalesByName, '상품명으로 검색하는 중 오류가 발생했습니다.', gdName, page);
}

// 닉네임으로 한정판매 게시글 검색 훅
export function useSearchLimitedSalesByMember(
  memId: string,
  page = 1
): {
  data: LimitedSalesListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchLimitedSalesByMember, '닉네임으로 검색하는 중 오류가 발생했습니다.', memId, page);
}

// 전체 검색 및 데이터 관리 훅
export function useFetchLimitedSalesData(
  searchQuery: string,
  searchType: LimitedSalesSearchType,
  currentPage: number
): {
  data: LimitedSalesListResponse | null;
  loading: boolean;
  error: string;
  setData: React.Dispatch<React.SetStateAction<LimitedSalesListResponse | null>>;
} {
  const [data, setData] = useState<LimitedSalesListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchData = async (): Promise<void> => {
      try {
        let result: LimitedSalesListResponse | null = null;
        if (searchType && searchQuery) {
          switch (searchType) {
            case 'name':
              result = await searchLimitedSalesByName(searchQuery, currentPage);
              break;
            case 'member':
              result = await searchLimitedSalesByMember(searchQuery, currentPage);
              break;
            default:
              throw new Error('Invalid search type');
          }
        } else {
          result = await getLimitedSalesList(currentPage);
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
