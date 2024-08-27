// QNA 관련 타입 정의가 포함된 파일을 가정합니다.
import type {
  QnaAnswerResponse,
  QnaDetailResponse,
  QnaListResponse,
  QnaNotResponseList,
  QnaResponseList,
} from '@/types/board/qna';
import apiClient from '@/lib/api/client';

// QNA 문의 리스트 가져오기
export async function getQnaList(page = 1): Promise<QnaListResponse> {
  const response = await apiClient.get<QnaListResponse>(`/memberqna/${page}`);
  return response.data;
}

// QNA 상세 조회
export async function getQnaDetail(meqIdx: number): Promise<QnaDetailResponse> {
  const response = await apiClient.get<QnaDetailResponse>(`/memberqna/detail/${meqIdx}`);
  return response.data;
}

// QNA 답변 등록
export async function postQnaAnswer(meqIdx: number, rsubject: string, rcontent: string): Promise<QnaAnswerResponse> {
  const response = await apiClient.post<QnaAnswerResponse>(`/memberqna/answer/post/${meqIdx}`, {
    rsubject,
    rcontent,
  });
  return response.data;
}

// QNA 미답변 리스트 가져오기
export async function getNotAnsweredQnaList(page = 1): Promise<QnaNotResponseList> {
  const response = await apiClient.get<QnaNotResponseList>(`/memberqna/notresponse/${page}`);
  return response.data;
}

// QNA 답변된 리스트 가져오기
export async function getAnsweredQnaList(page = 1): Promise<QnaResponseList> {
  const response = await apiClient.get<QnaResponseList>(`/memberqna/response/${page}`);
  return response.data;
}
