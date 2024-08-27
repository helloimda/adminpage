import type {
  DeleteLimitedSalesResponse,
  LimitedSalesDetailResponse,
  LimitedSalesListResponse,
} from '@/types/board/limited';
import apiClient from '@/lib/api/client';

// 한정판매 리스트 조회
export async function getLimitedSalesList(page = 1): Promise<LimitedSalesListResponse> {
  const response = await apiClient.get<LimitedSalesListResponse>(`/limitedsales/list/${page}`);
  return response.data;
}

// 한정판매 상세 조회
export async function getLimitedSalesDetail(gdIdx: number): Promise<LimitedSalesDetailResponse> {
  const response = await apiClient.get<LimitedSalesDetailResponse>(`/limitedsales/detail/${gdIdx}`);
  return response.data;
}

// 한정판매 상품 삭제
export async function deleteLimitedSales(gdIdx: number): Promise<DeleteLimitedSalesResponse> {
  const response = await apiClient.post<DeleteLimitedSalesResponse>(`/limitedsales/delete/${gdIdx}`);
  return response.data;
}

// 상품명으로 한정판매 게시글 검색
export async function searchLimitedSalesByName(gdName: string, page = 1): Promise<LimitedSalesListResponse> {
  const response = await apiClient.post<LimitedSalesListResponse>(`/limitedsales/post/search/goods/${gdName}/${page}`);
  return response.data;
}

// 닉네임으로 한정판매 게시글 검색
export async function searchLimitedSalesByMember(memId: string, page = 1): Promise<LimitedSalesListResponse> {
  const response = await apiClient.post<LimitedSalesListResponse>(`/limitedsales/post/search/member/${memId}/${page}`);
  return response.data;
}
