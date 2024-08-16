export interface TotalMembersResponse {
  totalMembers: number;
}

export interface MembersByTypeResponse {
  data: Record<string, number>[];
}

export type MemberDateType = 'date' | 'week' | 'month';
