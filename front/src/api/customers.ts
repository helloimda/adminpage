import type { MemberDateType, MembersByTypeResponse, TotalMembersResponse } from '@/types/customer';
import apiClient from '@/lib/api/client';
import { createLogger } from '@/lib/logger';

const apiLogger = createLogger({ prefix: 'API Client', level: 'DEBUG' });

export async function getTotalMembers(): Promise<number> {
  const response = await apiClient.get<TotalMembersResponse>('/analysis/total-members');
  apiLogger.error('resposne', response);
  return response.data.totalMembers;
}

export async function getMembersByType(type: MemberDateType): Promise<Record<string, number>[]> {
  const response = await apiClient.get<MembersByTypeResponse>(`/analysis/total-members/${type}`);
  return response.data.data;
}
