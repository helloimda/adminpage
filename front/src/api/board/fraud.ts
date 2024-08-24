import type { DeleteFraudBoardResponse, FraudBoardDetailResponse, FraudBoardListResponse } from '@/types/board/fraud';
import apiClient from '@/lib/api/client'; // API 클라이언트 임포트

// 사기 게시글 리스트 조회
export async function getFraudBoardList(page = 1): Promise<FraudBoardListResponse> {
  const response = await apiClient.get<FraudBoardListResponse>(`/postmanage/fraud/${page}`);
  return response.data;
}

// 사기 게시글 세부 정보 조회
export async function getFraudBoardDetail(bofIdx: number): Promise<FraudBoardDetailResponse> {
  const response = await apiClient.get<FraudBoardDetailResponse>(`/postmanage/fraud/detail/${bofIdx}`);
  return response.data;
}

// 사기 게시글 삭제
export async function deleteFraudBoard(bofIdx: number): Promise<DeleteFraudBoardResponse> {
  const response = await apiClient.post<DeleteFraudBoardResponse>(`/postmanage/fraud/delete/${bofIdx}`);
  return response.data;
}

// 닉네임으로 사기 게시글 검색
export async function searchFraudBoardByNick(id: string, page = 1): Promise<FraudBoardListResponse> {
  const response = await apiClient.get<FraudBoardListResponse>(`/postmanage/fraud/search/nick/${id}/${page}`);
  return response.data;
}

// 거래물품명으로 사기 게시글 검색
export async function searchFraudBoardByGoodName(id: string, page = 1): Promise<FraudBoardListResponse> {
  const response = await apiClient.get<FraudBoardListResponse>(`/postmanage/fraud/search/goodname/${id}/${page}`);
  return response.data;
}
