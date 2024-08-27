'use client';

import { useEffect, useState } from 'react';
import { getAnsweredQnaList, getNotAnsweredQnaList, getQnaDetail, getQnaList, postQnaAnswer } from '@/api/board/qna';

import {
  QnaAnswerResponse,
  QnaDetailResponse,
  QnaListResponse,
  QnaNotResponseList,
  QnaResponseList,
} from '@/types/board/qna';

// QNA API 함수들을 불러옴

// QNA 타입 정의를 불러옴

// 데이터를 가져오는 공통 훅
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

// QNA 문의 리스트 가져오기 훅
export function useQnaList(page = 1): {
  data: QnaListResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getQnaList, 'QNA 목록을 가져오는 중 오류가 발생했습니다.', page);
}

// QNA 상세 조회 훅
export function useQnaDetail(meqIdx: number): {
  data: QnaDetailResponse | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getQnaDetail, 'QNA 상세 정보를 가져오는 중 오류가 발생했습니다.', meqIdx);
}

// QNA 답변 등록 훅
export function usePostQnaAnswer(): {
  doPostAnswer: (meqIdx: number, rsubject: string, rcontent: string) => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const doPostAnswer = async (meqIdx: number, rsubject: string, rcontent: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: QnaAnswerResponse = await postQnaAnswer(meqIdx, rsubject, rcontent);

      if (response.message !== '문의 답변이 성공적으로 등록되었습니다.') {
        setError(response.message || '답변 등록 작업이 실패했습니다.');
      }
    } catch (err) {
      setError('답변 등록 작업 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { doPostAnswer, loading, error };
}

// 미답변 QNA 리스트 가져오기 훅
export function useNotAnsweredQnaList(page = 1): {
  data: QnaNotResponseList | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getNotAnsweredQnaList, '미답변 QNA 리스트를 가져오는 중 오류가 발생했습니다.', page);
}

// 답변된 QNA 리스트 가져오기 훅
export function useAnsweredQnaList(page = 1): {
  data: QnaResponseList | null;
  loading: boolean;
  error: string;
} {
  return useFetch(getAnsweredQnaList, '답변된 QNA 리스트를 가져오는 중 오류가 발생했습니다.', page);
}
