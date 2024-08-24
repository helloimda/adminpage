import type { Pagination } from '../common';

// 공지사항 게시글 타입
export interface Notice {
  bo_idx: number; // 게시글 ID
  mem_id: string; // 작성자 ID
  subject: string; // 제목
  cnt_view: number; // 조회수
  regdt: string; // 등록 날짜
}

// 공지사항 목록 응답 타입
export interface NoticeListResponse {
  data: Notice[]; // 공지사항 리스트
  pagination: Pagination;
}

// 공지사항 상세 응답 타입
export interface NoticeDetailResponse {
  bo_idx: number; // 게시글 ID
  mem_idx: number; // 작성자 회원 ID
  mem_id: string; // 작성자 아이디
  subject: string; // 제목
  content: string; // 내용
  cnt_view: number; // 조회수
  regdt: string; // 등록 날짜
  images: NoticeImage[]; // 이미지 리스트
}

// 공지사항 이미지 타입
export interface NoticeImage {
  file_name: string; // 파일명
  file_url: string; // 파일 URL
}

// 공지사항 삭제 응답 타입
export interface DeleteNoticeResponse {
  message: string; // 삭제 완료 메시지
}

export type NoticeSearchType = 'subject' | 'content' | 'nickname';
