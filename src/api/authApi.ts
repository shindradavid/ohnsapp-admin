import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '../lib/types';
import apiClient from '../lib/apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber: string;
  photoUrl: string;
  type: 'admin' | 'rider' | 'driver';
  createdAt: string;
}

export const authUserQueryKey = 'authUserQueryKey';

export const useAuthUser = () => {
  return useQuery({
    queryKey: [authUserQueryKey],
    retry: false,
    queryFn: async () => {
      const axiosResponse: ApiResponse<AuthUser> = (await apiClient.get('/auth/employees')).data;
      const authUser = axiosResponse.payload;
      return authUser;
    },
  });
};
