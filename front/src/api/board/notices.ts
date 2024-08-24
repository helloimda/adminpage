import type { DeleteNoticeResponse, NoticeDetailResponse, NoticeListResponse } from '@/types/board/notices';
import apiClient from '@/lib/api/client';

// 공지사항 목록 가져오기
export async function getNoticeList(page = 1): Promise<NoticeListResponse> {
  const response = await apiClient.get<NoticeListResponse>(`/postmanage/notice/${page}`);
  return response.data;
}

// 공지사항 상세 조회
export async function getNoticeDetail(boIdx: number): Promise<NoticeDetailResponse> {
  const response = await apiClient.get<NoticeDetailResponse>(`/postmanage/notice/detail/${boIdx}`);
  return response.data;
}

// 공지사항 삭제
export async function deleteNotice(boIdx: number): Promise<DeleteNoticeResponse> {
  const response = await apiClient.post<DeleteNoticeResponse>(`/postmanage/notice/delete/${boIdx}`);
  return response.data;
}

// 공지사항 제목으로 검색
export async function searchNoticeBySubject(subject: string, page = 1): Promise<NoticeListResponse> {
  const response = await apiClient.get<NoticeListResponse>(`/postmanage/notice/search/subject/${subject}/${page}`);
  return response.data;
}

// 공지사항 내용으로 검색
export async function searchNoticeByContent(content: string, page = 1): Promise<NoticeListResponse> {
  const response = await apiClient.get<NoticeListResponse>(`/postmanage/notice/search/content/${content}/${page}`);
  return response.data;
}

// 공지사항 닉네임으로 검색
export async function searchNoticeByNick(nickname: string, page = 1): Promise<NoticeListResponse> {
  const response = await apiClient.get<NoticeListResponse>(`/postmanage/notice/search/nick/${nickname}/${page}`);
  return response.data;
}
