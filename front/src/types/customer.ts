import { type Pagination } from './common';

export interface User {
  mem_idx: number; // 회원 고유 ID
  mem_id: string; // 회원 ID
  mem_nick: string; // 회원 닉네임 (null 가능)
  mem_email: string; // 회원 이메일
  mem_hp: string; // 회원 핸드폰 번호
  mem_profile_url: string | null; // 회원 프로필 URL (null 가능)
  todaydt: string; // 오늘 날짜
  isadmin: string; // 관리자 여부 ('Y' 또는 'N')
  stopdt: string | null; // 정지 날짜 (null 가능)
  stop_info: string | null; // 정지 정보 (null 가능)
}

export interface BenUser extends User {}

export interface GenderAgeData {
  age_group: string;
  male: number;
  female: number;
}

export type MemberDateType = 'date' | 'week' | 'month';

export interface TotalMembersResponse {
  totalMembers: number;
}

export interface MembersByTypeResponse {
  data: Record<string, number>[];
}

export type GenderAgeDataResponse = GenderAgeData[];

export interface UserListResponse {
  data: User[];
  pagination: Pagination;
}

export interface BenListResponse {
  data: BenUser[];
  pagination: Pagination;
}

export interface DoBenResponse {
  success: boolean;
  message: string;
}

export interface DoUnBenResponse {
  success: boolean;
  message: string;
}

export interface UserDeleteReponse {
  message: string;
}
