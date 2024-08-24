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

// 공지글 생성 요청 타입
export interface CreateNoticeRequest {
  mem_idx: number; // 작성자 회원 ID
  mem_id: string; // 작성자 아이디
  subject: string; // 제목
  content: string; // 내용
  tags?: string[] | null; // 태그 (옵션)
  istemp: 'Y' | 'N'; // 임시 저장 여부
  isdel: 'Y' | 'N'; // 삭제 여부
  cnt_view: number; // 조회수
}

// 공지글 생성 응답 타입
export interface CreateNoticeResponse {
  message: string; // 생성 완료 메시지
  bo_idx: number; // 생성된 게시글 ID
}

// 공지글 수정 요청 타입
export interface EditNoticeRequest {
  mem_idx: number; // 작성자 회원 ID
  mem_id: string; // 작성자 아이디
  subject: string; // 제목
  content: string; // 내용
  cnt_view: number; // 조회수
  regdt: string; // 등록 날짜
  images: NoticeImage[]; // 이미지 리스트
}

// 공지글 수정 응답 타입
export interface EditNoticeResponse {
  message: string; // 수정 완료 메시지
}

// 공지글 이미지 삭제 응답 타입
export interface DeleteNoticeImageResponse {
  success: boolean; // 성공 여부
  message: string; // 삭제 완료 메시지
}

// 공지글 검색 타입
export type NoticeSearchType = 'subject' | 'content' | 'nickname';
