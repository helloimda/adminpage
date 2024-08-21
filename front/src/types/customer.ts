export interface User {
  mem_idx: number;
  mem_id: string;
  mem_nick: string | null;
  mem_hp: string | null;
  mem_profile_url?: string;
  stop_info: string;
  stopdt: string | null;
}

export interface BenUser extends User {}

export interface GenderAgeData {
  age_group: string;
  male: number;
  female: number;
}

export interface Pagination {
  previousPage: number;
  nextPage: number;
  currentPage: number;
  totalPages: number;
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
