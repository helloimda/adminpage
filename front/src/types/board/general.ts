export interface GeneralBoard {
  bo_idx: number;
  mem_id: string;
  subject: string;
  cnt_view: number;
  cnt_star: number;
  cnt_good: number;
  cnt_bad: number;
  cnt_comment: number;
  regdt: string;
}

export interface GeneralBoardListResponse {
  data: GeneralBoard[];
  pagination: {
    previousPage: number | null;
    nextPage: number | null;
    currentPage: number;
    totalPages: number;
  };
}

export interface GeneralBoardDetailResponse {
  bo_idx: number; // 게시글 ID
  mem_idx: number; // 작성자 회원 ID
  mem_id: string; // 작성자 아이디
  ca_idx: number; // 카테고리 ID
  cd_subtag: string | null; // 서브태그 (선택적)
  brand_idx: number | null; // 브랜드 ID (선택적)
  cal_idx: number | null; // 캘린더 ID (선택적)
  subject: string; // 게시글 제목
  content: string; // 게시글 내용
  link: string | null; // 링크 (선택적)
  tags: string; // 태그
  newsdt: string | null; // 뉴스 날짜 (선택적)
  cnt_view: number; // 조회수
  cnt_star: number; // 별점 수
  avg_star: number; // 평균 별점
  cnt_good: number; // 좋아요 수
  cnt_bad: number; // 싫어요 수
  cnt_comment: number; // 댓글 수
  cnt_bookmark: number; // 북마크 수
  cnt_img: number; // 이미지 수
  istemp: string; // 임시 저장 여부 ("Y" 또는 "N")
  popdt: string | null; // 인기 게시글 날짜 (선택적)
  regdt: string; // 등록 날짜
  images: GeneralBoardImage[]; // 이미지 리스트
}

export interface GeneralBoardImage {
  img_idx: number; // 이미지 ID
  file_name: string; // 파일명
  file_url: string; // 파일 URL
}

export interface DeleteGeneralBoardResponse {
  message: string;
}

export type GeneralBoardSearchType = 'subject' | 'content' | 'nickname';

export interface PostCategory {
  ca_idx: number; // 카테고리 ID
  cd_subtag: string | null; // 서브태그 (null일 수 있음)
  count: number; // 해당 카테고리의 포스트 수
}

export type PostCategoryListResponse = PostCategory[];
