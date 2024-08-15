export interface User {
  mem_idx: number; // 사용자 인덱스
  mem_id: string; // 사용자 ID
  mem_nick: string | null; // 사용자 닉네임 (null 가능)
  mem_profile_url: string | null; // 사용자 프로필 URL (null 가능)
  isadmin: string;
  [key: string]: unknown;
}
