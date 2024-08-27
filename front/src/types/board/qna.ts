// QNA 이미지 타입
export interface QnaImage {
  file_name: string; // 이미지 파일명
  file_url: string; // 이미지 파일 URL
}

// QNA 게시글 아이템 타입
export interface QnaItem {
  meq_idx: number; // QNA ID
  mem_idx: number; // 회원 ID
  mem_id: string; // 회원 아이디
  subject: string; // 제목
  content: string; // 내용
  qtype: string | null; // QNA 타입 (QNA, CBOARD 등)
  reason: string | null; // 사유 (선택적)
  isadult: string | null; // 성인 여부 (Y/N)
  tmem_idx: number | null; // 대상 회원 ID (선택적)
  tmem_id: string | null; // 대상 회원 아이디 (선택적)
  rsubject: string; // 답변 제목
  rcontent: string; // 답변 내용
  rdt: string | null; // 답변 날짜 (선택적)
  vdt: string | null; // 조회 날짜 (선택적)
  cnt_img: number; // 이미지 수
  cnt_view: number; // 조회수
  isview: string; // 조회 가능 여부 (Y/N)
  isresponse: string; // 응답 여부 (Y/N)
  regdt: string; // 등록 날짜
}

// QNA 리스트 응답 타입
export interface QnaListResponse {
  data: QnaItem[]; // QNA 리스트
  pagination: {
    previousPage: number | null; // 이전 페이지
    nextPage: number | null; // 다음 페이지
    currentPage: number; // 현재 페이지
    totalPages: number; // 전체 페이지 수
  };
}

// QNA 상세 응답 타입 (이미지 포함)
export interface QnaDetailResponse extends QnaItem {
  images: QnaImage[]; // 상세 이미지 리스트
}

// QNA 답변 등록 응답 타입
export interface QnaAnswerResponse {
  message: string; // 답변 성공 메시지
}

// QNA 미답변 리스트 응답 타입
export interface QnaNotResponseList extends QnaListResponse {}

// QNA 답변된 리스트 응답 타입
export interface QnaResponseList extends QnaListResponse {}
