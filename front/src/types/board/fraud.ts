export interface FraudBoard {
  bof_idx: number; // 게시글 ID
  mem_id: string; // 작성자 ID
  bof_type: string; // 게시글 유형 (예: C, Q)
  gd_name: string; // 거래물품명
  damage_dt: string; // 피해 날짜
  damage_type: string; // 피해 유형 (예: R, T)
  cnt_view: number; // 조회수
  regdt: string; // 작성일
}

// 사기 게시글 세부 정보를 나타내는 타입
export interface FraudBoardDetail extends FraudBoard {
  content: string; // 게시글 내용
  account_num: string; // 계좌번호
  account_bank: string; // 은행명
  msg_type: string | null; // 메시지 유형 (null 가능)
  msg_id: string; // 메시지 ID
  damage_amount: number; // 피해 금액
  hp: string; // 전화번호
  sex: string; // 성별
  email: string | null; // 이메일 (null 가능)
  url: string; // URL
  cnt_img: number; // 이미지 수
  images: {
    file_name: string;
    file_url: string;
  }[];
}

// 사기 게시글 목록 조회의 응답 타입
export interface FraudBoardListResponse {
  data: FraudBoard[]; // 사기 게시글 목록
  pagination: {
    // 페이지네이션 정보
    previousPage: number | null; // 이전 페이지 번호 (null 가능)
    nextPage: number | null; // 다음 페이지 번호 (null 가능)
    currentPage: number; // 현재 페이지 번호
    totalPages: number; // 전체 페이지 수
  };
}

// 사기 게시글 세부 조회의 응답 타입
export interface FraudBoardDetailResponse extends FraudBoardDetail {}

// 사기 게시글 삭제의 응답 타입
export interface DeleteFraudBoardResponse {
  message: string; // 삭제 성공 메시지
}

export type FraudSearchType = 'goodname' | 'nick';
