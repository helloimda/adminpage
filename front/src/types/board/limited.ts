export interface LimitedSalesImage {
  file_name: string; // 이미지 파일명
  file_url: string; // 이미지 파일 URL
  thumbnail_url: string; // 썸네일 URL
}

export interface LimitedSalesItem {
  gd_idx: number; // 상품 ID
  cg_idx: number; // 카테고리 ID
  ca_idx: number; // 소분류 ID
  brand_idx: number; // 브랜드 ID
  brand_str: string; // 브랜드 이름
  btype: string; // 상품 타입
  mem_idx: number; // 회원 ID
  mem_id: string; // 회원 아이디
  gd_name: string; // 상품명
  gd_num: string; // 상품 번호
  gd_status: string; // 상품 상태 (판매중 등)
  gd_view: string; // 상품 조회 가능 여부
  isware: string; // 창고 여부
  buy_price: number | null; // 구매 가격 (선택적)
  price: number; // 판매 가격
  buy_place: string; // 구매 장소
  buy_year: string; // 구매 년도
  buy_month: string; // 구매 월
  condition_goods: string; // 상품 상태
  condition_state: string; // 상태 설명
  isbox: string; // 박스 포함 여부
  iswarranty: string; // 보증서 포함 여부
  isetc: string; // 기타 포함 여부
  component: string; // 구성품
  content: string; // 상품 설명
  isoffer: string; // 제안 여부
  isexchange: string; // 교환 여부
  proposal: string; // 제안 내용
  istemp: string; // 임시 저장 여부 ("Y" 또는 "N")
  cnt_view: number; // 조회수
  cnt_star: number; // 별점 수
  avg_star: number; // 평균 별점
  cnt_good: number; // 좋아요 수
  cnt_bad: number; // 싫어요 수
  cnt_bookmark: number; // 북마크 수
  cnt_comment: number | null; // 댓글 수 (선택적)
  cnt_img: number; // 이미지 수
  cnt_pull: number; // 끌어올리기 수
  cnt_noteGroup: number; // 노트 그룹 수
  gddt: string; // 상품 등록 날짜
  regdt: string; // 등록 날짜
  images: LimitedSalesImage[]; // 이미지 리스트
}

export interface LimitedSalesListResponse {
  data: LimitedSalesItem[]; // 상품 리스트
  pagination: {
    previousPage: number | null; // 이전 페이지
    nextPage: number | null; // 다음 페이지
    currentPage: number; // 현재 페이지
    totalPages: number; // 전체 페이지 수
  };
}

export interface LimitedSalesDetailResponse {
  message: string;
}

export interface DeleteLimitedSalesResponse {
  message: string; // 삭제 성공 메시지
}

export type LimitedSalesSearchType = 'name' | 'member';
