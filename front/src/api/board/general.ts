import type {
  DeleteGeneralBoardResponse,
  GeneralBoardDetailResponse,
  GeneralBoardListResponse,
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
