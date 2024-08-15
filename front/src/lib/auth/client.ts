'use client';

import type { User } from '@/types/user';

export interface SignInWithPasswordParams {
  id: string;
  pass: string;
}

interface LoginAPiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  data: {
    mem_idx: number;
    mem_id: string;
    mem_nick: string | null;
    mem_profile_url: string | null;
    isadmin: string;
    token: string;
  };
}

class AuthClient {
  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ data?: User | null; error?: string }> {
    const { id, pass } = params;

    try {
      const response = await fetch('https://api.hituru.com:22443/v1.0/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, pass }),
      });

      const result = (await response.json()) as LoginAPiResponse;

      if (result.success && result.data) {
        const { token, ...userData } = result.data;

        if (userData.mem_idx && userData.mem_id && userData.isadmin) {
          localStorage.setItem('auth-token', token);

          const user: User = {
            mem_idx: userData.mem_idx,
            mem_id: userData.mem_id,
            mem_nick: userData.mem_nick,
            mem_profile_url: userData.mem_profile_url,
            isadmin: userData.isadmin,
          };

          return { data: user };
        }
      }

      return { error: result.message || '로그인에 실패하였습니다.' };
    } catch (error) {
      return { error: '네트워크 오류가 발생했습니다.' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('auth-token');

    if (!token) {
      return { data: null };
    }

    try {
      const response = await fetch('https://api.hituru.com:22443/v1.0/admin/tokenCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = (await response.json()) as LoginAPiResponse;

      if (result.success && result.data) {
        const { ...userData } = result.data;

        if (userData.mem_idx && userData.mem_id && userData.isadmin) {
          const user: User = {
            mem_idx: userData.mem_idx,
            mem_id: userData.mem_id,
            mem_nick: userData.mem_nick,
            mem_profile_url: userData.mem_profile_url,
            isadmin: userData.isadmin,
          };

          return { data: user };
        }
      }

      return { data: null };
    } catch (error) {
      return { error: '사용자 정보를 가져오는 데 실패했습니다.' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      localStorage.removeItem('auth-token');
      return {};
    } catch (error) {
      return { error: '로그아웃 중 오류가 발생했습니다.' };
    }
  }
}

export const authClient = new AuthClient();
