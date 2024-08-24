import React, { useEffect, useState } from 'react';
import {
  deleteNotice,
  getNoticeDetail,
  getNoticeList,
  searchNoticeByContent,
  searchNoticeByNick,
  searchNoticeBySubject,
} from '@/api/board/notices';

import type {
  DeleteNoticeResponse,
  NoticeDetailResponse,
  NoticeListResponse,
  NoticeSearchType,
} from '@/types/board/notices';

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

// 공지사항 목록 가져오기 훅
export function useNoticeList(page = 1): {
  data: NoticeListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getNoticeList, '공지사항 목록을 가져오는 중 오류가 발생했습니다.', page, undefined);
}

// 공지사항 삭제 훅
export function useDeleteNotice(): {
  doDeleteNotice: (boIdx: number) => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doDeleteNotice = async (boIdx: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: DeleteNoticeResponse = await deleteNotice(boIdx);

      if (response.message !== '게시글이 성공적으로 삭제되었습니다.') {
        setError(response.message || '게시글 삭제 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('게시글 삭제 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doDeleteNotice, loading, error };
}

// 제목으로 공지사항 검색 훅
export function useSearchNoticeBySubject(
  id: string,
  page = 1
): {
  data: NoticeListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchNoticeBySubject, '제목으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 내용으로 공지사항 검색 훅
export function useSearchNoticeByContent(
  id: string,
  page = 1
): {
  data: NoticeListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchNoticeByContent, '내용으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 닉네임으로 공지사항 검색 훅
export function useSearchNoticeByNick(
  id: string,
  page = 1
): {
  data: NoticeListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(searchNoticeByNick, '닉네임으로 게시글을 검색하는 중 오류가 발생했습니다.', id, page);
}

// 공지사항 상세 조회 훅
export function useNoticeDetail(boIdx: number): {
  data: NoticeDetailResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getNoticeDetail, '게시글 목록을 가져오는 중 오류가 발생했습니다.', boIdx, undefined);
}

// 공지사항 데이터 가져오기 훅
export function useFetchNoticeData(
  searchQuery: string,
  searchType: NoticeSearchType,
  currentPage: number
): {
  data: NoticeListResponse | null;
  loading: boolean;
  error: string;
  setData: React.Dispatch<React.SetStateAction<NoticeListResponse | null>>;
} {
  const [data, setData] = useState<NoticeListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchData = async (): Promise<void> => {
      try {
        let result: NoticeListResponse | null = null;
        if (searchType && searchQuery) {
          switch (searchType) {
            case 'subject':
              result = await searchNoticeBySubject(searchQuery, currentPage);
              break;
            case 'content':
              result = await searchNoticeByContent(searchQuery, currentPage);
              break;
            case 'nickname':
              result = await searchNoticeByNick(searchQuery, currentPage);
              break;
            default:
              break;
          }
        } else {
          result = await getNoticeList(currentPage);
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
