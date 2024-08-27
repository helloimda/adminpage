export interface BoardReportItem {
  mem_idx: number; // 회원 ID
  mem_id: string; // 회원 아이디
  bo_idx: number; // 게시글 ID
  content: string; // 신고 내용
  regdt: string; // 신고 날짜
}

// 게시글 신고 리스트 응답 타입
export interface BoardReportListResponse {
  data: BoardReportItem[]; // 신고 리스트
  pagination: {
    previousPage: number | null; // 이전 페이지
    nextPage: number | null; // 다음 페이지
    currentPage: number; // 현재 페이지
    totalPages: number; // 전체 페이지 수
  };
}

// 게시글 신고 카운트 아이템 타입
export interface BoardReportCountItem {
  bo_idx: number; // 게시글 ID
  content: string; // 신고 내용
  report_count: number; // 신고 횟수
  total_report_count: number; // 총 신고 횟수
}

// 게시글 신고 카운트 응답 타입
export type BoardReportCountResponse = BoardReportCountItem[];

// 유저 신고 리스트 아이템 타입
export interface MemberReportItem {
  mem_idx: number; // 회원 ID
  mem_id: string; // 회원 아이디
  gd_idx: number; // 유저 ID
  content: string; // 신고 내용
  regdt: string; // 신고 날짜
}

// 유저 신고 리스트 응답 타입
export interface MemberReportListResponse {
  data: MemberReportItem[]; // 유저 신고 리스트
  pagination: {
    previousPage: number | null; // 이전 페이지
    nextPage: number | null; // 다음 페이지
    currentPage: number; // 현재 페이지
    totalPages: number; // 전체 페이지 수
  };
}

// 유저 신고 카운트 아이템 타입
export interface MemberReportCountItem {
  gd_idx: number; // 유저 ID
  content: string; // 신고 내용
  report_count: number; // 신고 횟수
  total_report_count: number; // 총 신고 횟수
}

// 유저 신고 카운트 응답 타입
export type MemberReportCountResponse = MemberReportCountItem[];
