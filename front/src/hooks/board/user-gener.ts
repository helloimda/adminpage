'use client';

import React, { useEffect, useState } from 'react';
import {
  deleteGeneralBoard,
  fetchPostCategoriesByPeriod,
  getGeneralBoardDetail,
  getGeneralBoardList,
  searchGeneralBoardByContent,
  searchGeneralBoardByNick,
  searchGeneralBoardBySubject,
} from '@/api/board/general';

import type {
  DeleteGeneralBoardResponse,
  GeneralBoardDetailResponse,
  GeneralBoardListResponse,
  GeneralBoardSearchType,
  PostCategoryListResponse,
} from '@/types/board/general';

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

// 일반 게시글 목록 가져오기 훅
export function useGeneralBoardList(page = 1): {
  data: GeneralBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getGeneralBoardList, '게시글 목록을 가져오는 중 오류가 발생했습니다.', page, undefined);
}

// 일반 게시글 삭제 훅
export function useDeleteGeneralBoard(): {
  doDeleteBoard: (boIdx: number) => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doDeleteBoard = async (boIdx: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: DeleteGeneralBoardResponse = await deleteGeneralBoard(boIdx);

      if (response.message !== '게시글이 성공적으로 삭제되었습니다.') {
        setError(response.message || '게시글 삭제 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('게시글 삭제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doDeleteBoard, loading, error };
}

// 제목으로 일반 게시글 검색 훅
export function useSearchGeneralBoardBySubject(
  id: string,
  page = 1
): {
  data: GeneralBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchGeneralBoardBySubject, '제목으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 내용으로 일반 게시글 검색 훅
export function useSearchGeneralBoardByContent(
  id: string,
  page = 1
): {
  data: GeneralBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchGeneralBoardByContent, '내용으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 닉네임으로 일반 게시글 검색 훅
export function useSearchGeneralBoardByNick(
  id: string,
  page = 1
): {
  data: GeneralBoardListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchGeneralBoardByNick, '닉네임으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 디테일
export function useGeneralBoardDetail(boIdx: number): {
  data: GeneralBoardDetailResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getGeneralBoardDetail, '게시글 목록을 가져오는 중 오류가 발생했습니다.', boIdx, undefined);
}

export function useFetchBoardData(
  searchQuery: string,
  searchType: GeneralBoardSearchType,
  currentPage: number
): {
  data: GeneralBoardListResponse | null;
  loading: boolean;
  error: string;
  setData: React.Dispatch<React.SetStateAction<GeneralBoardListResponse | null>>;
} {
  const [data, setData] = useState<GeneralBoardListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchData = async (): Promise<void> => {
      try {
        let result: GeneralBoardListResponse | null = null;
        if (searchType && searchQuery) {
          switch (searchType) {
            case 'subject':
              result = await searchGeneralBoardBySubject(searchQuery, currentPage);
              break;
            case 'content':
              result = await searchGeneralBoardByContent(searchQuery, currentPage);
              break;
            case 'nickname':
              result = await searchGeneralBoardByNick(searchQuery, currentPage);
              break;
            default:
              break;
          }
        } else {
          result = await getGeneralBoardList(currentPage);
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

// 통계 카테고리
export function useGeneralPostCategoriesByPeriod(): {
  data: PostCategoryListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(
    fetchPostCategoriesByPeriod,
    '포스트 카테고리 데이터를 가져오는 중 오류가 발생했습니다.',
    undefined,
    undefined
  );
}
