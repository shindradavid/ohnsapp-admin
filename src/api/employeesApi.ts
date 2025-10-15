import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiResponse, ImageFile } from '../lib/types';
import { base64ToBlob, isWeb } from '../lib/utils';
import apiClient from '../lib/apiClient';

export interface Employee {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber: string;
  photoUrl: string;
  isActive: boolean;
  createdAt: string;
}

export const employeesQueryKey = 'employeesQueryKey';

export const useEmployee = () => {
  return useQuery({
    queryKey: [employeesQueryKey],
    queryFn: async () => {
      const axiosData: ApiResponse<Employee[]> = (await apiClient.get('/employees')).data;
      const employee = axiosData.payload;
      return employee;
    },
    refetchInterval: 10000,
  });
};

interface CreateEmployeeMutationData {
  name: string;
  phoneNumber: string;
  password: string;
  photo: ImageFile;
}

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEmployeeMutationData) => {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('phoneNumber', payload.phoneNumber);
      formData.append('password', payload.password);

      if (isWeb) {
        const blob = base64ToBlob(payload.photo.uri, payload.photo.mimeType);

        const fileToUpload = new File([blob], payload.photo.fileName, {
          type: payload.photo.mimeType,
        });

        formData.append('photo', fileToUpload);
      } else {
        formData.append('photo', {
          uri: payload.photo.uri,
          type: payload.photo.mimeType,
          name: payload.photo.fileName,
        } as any);
      }

      const axiosData: ApiResponse<Employee> = (
        await apiClient.post('/employees', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;
      return axiosData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });
    },
  });
};
