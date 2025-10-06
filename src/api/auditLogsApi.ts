import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { ApiResponse } from '../lib/types';
import apiClient from '../lib/apiClient';

export interface AuditLog {
  id: string;
  performedBy: {
    id: string;
    employeeAccount: {
      id: string;
      name: string;
      phoneNumber: string;
      photoUrl: string;
    };
  };
  actionDescription: string;
  affectedResourceType?: string;
  affectedResourceId?: string;
  timestamp: string;
}

export const auditLogsQueryKey = 'auditLogsQueryKey';

export const useAuditLogs = (date: Date) => {
  return useQuery({
    queryKey: [auditLogsQueryKey, format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      const params: Record<string, any> = { date: format(date, 'yyyy-MM-dd') };
      const axiosData = (await apiClient.get<ApiResponse<AuditLog[]>>('/audit-logs', { params })).data;
      const auditLogs = axiosData.payload;
      return auditLogs;
    },
    refetchInterval: 40000,
  });
};
