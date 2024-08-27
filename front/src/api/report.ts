// 타입 정의를 임포트하세요
import type {
  BoardReportCountResponse,
  BoardReportListResponse,
  MemberReportCountResponse,
  MemberReportListResponse,
} from '@/types/board/report';
import apiClient from '@/lib/api/client';

// 게시글 신고 리스트 가져오기
export async function getBoardReportList(page = 1): Promise<BoardReportListResponse> {
  const response = await apiClient.get<BoardReportListResponse>(`/reports/board/${page}`);
  return response.data;
}

// 게시글 신고 카운트 가져오기
export async function getBoardReportCount(): Promise<BoardReportCountResponse> {
  const response = await apiClient.get<BoardReportCountResponse>(`/reports/boardcount`);
  return response.data;
}

// 유저 신고 리스트 가져오기
export async function getMemberReportList(page = 1): Promise<MemberReportListResponse> {
  const response = await apiClient.get<MemberReportListResponse>(`/reports/member/${page}`);
  return response.data;
}

// 유저 신고 카운트 가져오기
export async function getMemberReportCount(): Promise<MemberReportCountResponse> {
  const response = await apiClient.get<MemberReportCountResponse>(`/reports/membercount`);
  return response.data;
}
