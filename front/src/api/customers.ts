import type {
  BenListResponse,
  DoBenResponse,
  DoUnBenResponse,
  GenderAgeDataResponse,
  MemberDateType,
  MembersByTypeResponse,
  UserDeleteReponse,
  UserListResponse,
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

export async function getUserList(page: number): Promise<UserListResponse> {
  const response = await apiClient.get<UserListResponse>(`/members/${page}`);
  return response.data;
}

export async function searchIdUserList(id: string, page: number): Promise<UserListResponse> {
  if (id === '') return Promise.resolve({} as UserListResponse);
  const response = await apiClient.get<UserListResponse>(`/members/search/id/${id}/${page}`);
  return response.data;
}

export async function searchNickUserList(nick: string, page: number): Promise<UserListResponse> {
  if (nick === '') return Promise.resolve({} as UserListResponse);
  const response = await apiClient.get<UserListResponse>(`/members/search/nick/${nick}/${page}`);
  return response.data;
}

export async function getBenUserList(page: number): Promise<BenListResponse> {
  const response = await apiClient.get<BenListResponse>(`/users/banuser/${page}`);
  return response.data;
}

export async function searchIdBenUserList(id: string, page: number): Promise<UserListResponse> {
  if (id === '') return Promise.resolve({} as UserListResponse);
  const response = await apiClient.get<UserListResponse>(`/users/search/id/${id}/${page}`);
  return response.data;
}

export async function searchNickBenUserList(nick: string, page: number): Promise<UserListResponse> {
  if (nick === '') return Promise.resolve({} as UserListResponse);
  const response = await apiClient.get<UserListResponse>(`/users/search/nick/${nick}/${page}`);
  return response.data;
}

export async function postDoBen(memId: number, stopInfo: string, stopdt: string): Promise<DoBenResponse> {
  if (stopInfo === '' || stopdt === '') return Promise.resolve({} as DoBenResponse);
  const response = await apiClient.post<DoBenResponse>(`/users/ban/${memId}`, {
    stop_info: stopInfo,
    stopdt,
  });
  return response.data;
}

export async function postDoUnBen(memId: number): Promise<DoUnBenResponse> {
  const response = await apiClient.post<DoUnBenResponse>(`/users/unban/${memId}`);
  return response.data;
}

export async function deleteUser(memIdx: number): Promise<UserDeleteReponse> {
  const response = await apiClient.post<UserDeleteReponse>(`/users/delete/${memIdx}`);
  return response.data;
}
