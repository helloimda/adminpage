export interface TotalMembersResponse {
  totalMembers: number;
}

export interface MembersByTypeResponse {
  data: Record<string, number>[];
}

export interface GenderAgeData {
  age_group: string;
  male: number;
  female: number;
}

export type GenderAgeDataResponse = GenderAgeData[];

export type MemberDateType = 'date' | 'week' | 'month';
