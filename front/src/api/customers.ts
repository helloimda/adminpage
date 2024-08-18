import type {
  BenListResponse,
  DoBenResponse,
  DoUnBenResponse,
  GenderAgeDataResponse,
  MemberDateType,
  MembersByTypeResponse,
} from '@/types/customer';
import apiClient from '@/lib/api/client';

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await apiClient.get<T>(endpoint);
  return response.data;
}

async function fetchMembersData(endpoint: string, type: MemberDateType): Promise<Record<string, number>[]> {
  return fetchData<MembersByTypeResponse>(`${endpoint}/${type}`).then((data) => data.data);
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

export async function getGenderAge(): Promise<GenderAgeDataResponse> {
  return fetchData<GenderAgeDataResponse>('/analysis/gender-age-stats');
}

export async function getBenUserList(page: number): Promise<BenListResponse> {
  const response = await apiClient.get<BenListResponse>(`/users/banuser/${page}`);
  return response.data;
}

export async function postDoBen(memId: number): Promise<DoBenResponse> {
  const response = await apiClient.post<DoBenResponse>(`/users/banuser/${memId}`);
  return response.data;
}

export async function postDoUnBen(memId: number): Promise<DoUnBenResponse> {
  const response = await apiClient.post<DoUnBenResponse>(`/users/unban/${memId}`);
  return response.data;
}
