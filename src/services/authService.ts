import { removeStorageItem, setStorageItem } from '../lib/utils';
import { SESSION_ID_KEY } from '../lib/constants';
import apiClient from '../lib/apiClient';
import { ApiResponse } from '../lib/types';
import { AuthUser } from '../api/authApi';

interface LoginResponse {
  user: AuthUser;
  sessionId: string;
}

export async function loginWithPhoneNumberAndPassword(phoneNumber: string, password: string) {
  const axiosResponse = await apiClient.post<ApiResponse<LoginResponse>>('/auth/employees/login', {
    phoneNumber,
    password,
  });

  if (axiosResponse.status == 200) {
    const responseData = axiosResponse.data;

    if (responseData.success && responseData.payload) {
      const { user, sessionId } = responseData.payload;

      if (!user || !sessionId) {
        return {
          error: 'Login failed',
        };
      }

      await setStorageItem(SESSION_ID_KEY, sessionId);

      return { user };
    } else {
      return { error: responseData.message || 'Login failed' };
    }
  } else {
    return { error: axiosResponse.data.message || 'Login failed' };
  }
}

export async function logout() {
  const axiosResponse = await apiClient.delete('/auth/logout');
  await removeStorageItem(SESSION_ID_KEY);

  if (axiosResponse.status == 204) {
    return {};
  } else {
    return { error: axiosResponse.data.message || 'Logout failed' };
  }
}

export default {
  loginWithPhoneNumberAndPassword,
  logout,
};
