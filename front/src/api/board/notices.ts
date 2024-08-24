import { DeleteGeneralCommentResponse, GeneralCommentListResponse } from '@/types/board/general';
import type {
  CreateNoticeRequest,
  CreateNoticeResponse,
  DeleteNoticeImageResponse,
  DeleteNoticeResponse,
  EditNoticeRequest,
  EditNoticeResponse,
  NoticeDetailResponse,
  NoticeListResponse,
} from '@/types/board/notices';
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

export async function getGeneralComments(boIdx: number): Promise<GeneralCommentListResponse> {
  const response = await apiClient.get<GeneralCommentListResponse>(`/postmanage/general/comment/${boIdx}`);
  return response.data;
}

// 일반 게시글 댓글 삭제
export async function deleteGeneralComment(cmtIdx: number): Promise<DeleteGeneralCommentResponse> {
  const response = await apiClient.get<DeleteGeneralCommentResponse>(`/postmanage/general/comment/delete/${cmtIdx}`);
  return response.data;
}

// 공지사항 생성
export async function createNotice(data: CreateNoticeRequest): Promise<CreateNoticeResponse> {
  const response = await apiClient.post<CreateNoticeResponse>('/postmanage/notice/post', data);
  return response.data;
}

// 공지사항 수정
export async function editNotice(boIdx: number, data: EditNoticeRequest): Promise<EditNoticeResponse> {
  const response = await apiClient.post<EditNoticeResponse>(`/postmanage/notice/detail/${boIdx}`, data);
  return response.data;
}

// 공지사항 이미지 삭제
export async function deleteNoticeImage(boIdx: number, imgIdx: number): Promise<DeleteNoticeImageResponse> {
  const response = await apiClient.post<DeleteNoticeImageResponse>(`/postmanage/notice/imgdelete/${boIdx}/${imgIdx}`);
  return response.data;
}
