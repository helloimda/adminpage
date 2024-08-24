import type {
  DeleteGeneralBoardResponse,
  DeleteGeneralCommentResponse,
  GeneralBoardDetailResponse,
  GeneralBoardListResponse,
  GeneralCommentListResponse,
  PostCategoryListResponse,
} from '@/types/board/general';
import apiClient from '@/lib/api/client';

export async function getGeneralBoardList(page = 1): Promise<GeneralBoardListResponse> {
  const response = await apiClient.get<GeneralBoardListResponse>(`/postmanage/general/${page}`);
  return response.data;
}

// 상세 조회
export async function getGeneralBoardDetail(boIdx: number): Promise<GeneralBoardDetailResponse> {
  const response = await apiClient.get<GeneralBoardDetailResponse>(`/postmanage/general/detail/${boIdx}`);
  return response.data;
}

// 삭제
export async function deleteGeneralBoard(boIdx: number): Promise<DeleteGeneralBoardResponse> {
  const response = await apiClient.post<DeleteGeneralBoardResponse>(`/postmanage/general/delete/${boIdx}`);
  return response.data;
}

// 제목으로 검색
export async function searchGeneralBoardBySubject(id: string, page = 1): Promise<GeneralBoardListResponse> {
  const response = await apiClient.get<GeneralBoardListResponse>(`/postmanage/general/search/subject/${id}/${page}`);
  return response.data;
}

// 내용으로 검색
export async function searchGeneralBoardByContent(id: string, page = 1): Promise<GeneralBoardListResponse> {
  const response = await apiClient.get<GeneralBoardListResponse>(`/postmanage/general/search/content/${id}/${page}`);
  return response.data;
}

// 닉네임으로 검색
export async function searchGeneralBoardByNick(id: string, page = 1): Promise<GeneralBoardListResponse> {
  const response = await apiClient.get<GeneralBoardListResponse>(`/postmanage/general/search/nick/${id}/${page}`);
  return response.data;
}

//통계
export async function fetchPostCategoriesByPeriod(): Promise<PostCategoryListResponse> {
  const response = await apiClient.get<PostCategoryListResponse>(`/analysis/postscategoryall`);
  return response.data;
}

// 일반 전체 댓글 리스트 가져오기
export async function getGeneralCommentList(page = 1): Promise<GeneralCommentListResponse> {
  const response = await apiClient.get<GeneralCommentListResponse>(`/postmanage/general/comment/list/${page}`);
  return response.data;
}

// 일반 단일 게시글의 댓글 리스트 가져오기
export async function getGeneralCommentDetail(boIdx: number, page = 1): Promise<GeneralCommentListResponse> {
  const response = await apiClient.get<GeneralCommentListResponse>(
    `/postmanage/general/comment/detail/${boIdx}/${page}`
  );
  return response.data;
}

export async function searchGeneralCommentByNickname(memId: string, page = 1): Promise<GeneralCommentListResponse> {
  const response = await apiClient.get<GeneralCommentListResponse>(
    `/postmanage/general/comment/search/nickname/${memId}/${page}`
  );
  return response.data;
}

// 일반글 댓글 내용 검색
export async function searchGeneralCommentByContent(content: string, page = 1): Promise<GeneralCommentListResponse> {
  const response = await apiClient.get<GeneralCommentListResponse>(
    `/postmanage/general/comment/search/content/${content}/${page}`
  );
  return response.data;
}

// 댓글 삭제
export async function deleteGeneralComment(cmtIdx: number): Promise<DeleteGeneralCommentResponse> {
  const response = await apiClient.post<DeleteGeneralCommentResponse>(`/postmanage/general/comment/delete/${cmtIdx}`);
  return response.data;
}

export type GeneralCommentSearchType = 'content' | 'nickname';
