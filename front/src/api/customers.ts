import type { MemberDateType, MembersByTypeResponse } from '@/types/customer';
import apiClient from '@/lib/api/client';

async function fetchMembersData(endpoint: string, type: MemberDateType): Promise<Record<string, number>[]> {
  const response = await apiClient.get<MembersByTypeResponse>(`${endpoint}/${type}`);
  return response.data.data;
}

export async function getMembersByType(type: MemberDateType): Promise<Record<string, number>[]> {
  return fetchMembersData('/analysis/total-members', type);
}

export async function getVisitedMembers(type: MemberDateType): Promise<Record<string, number>[]> {
  return fetchMembersData('/analysis/visitors', type);
}

export async function getRegisterMembers(type: MemberDateType): Promise<Record<string, number>[]> {
  return fetchMembersData('/analysis/registrations', type);
}
