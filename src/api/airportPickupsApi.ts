import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiResponse } from '../lib/types';
import apiClient from '../lib/apiClient';

export interface Airport {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
}

export const airportsQueryKey = 'airportsQueryKey';

export const useAirports = () => {
  return useQuery({
    queryKey: [airportsQueryKey],
    queryFn: async () => {
      const axiosData = (await apiClient.get<ApiResponse<Airport[]>>('/airport-pickups/airports')).data;
      const airports = axiosData.payload;
      return airports;
    },
    refetchInterval: 10000,
  });
};

interface CreateAirportMutationPayload {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
}

export const useCreateAirportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAirportMutationPayload) => {
      const axiosData = (await apiClient.post<ApiResponse<Airport>>('/airport-pickups/airports', payload)).data;
      return axiosData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [airportsQueryKey] });
    },
  });
};

export interface AirportPickupBookings {
  id: string;
  fare: number;
  airport: Airport;
  note: string | null;
  createdAt: string;
  status: 'pending' | '';
  dropOffLatitude: number;
  dropOffLongitude: number;
  dropOffLocationName: string | null;
}

export const airportPickupBookingsQueryKey = 'airportPickupBookingsQueryKey';

export const useAirportPickupBookings = () => {
  return useQuery({
    queryKey: [airportPickupBookingsQueryKey],
    queryFn: async () => {
      const axiosData = (await apiClient.get<ApiResponse<Airport[]>>('/airport-pickups/airports')).data;
      const airportPickupBookings = axiosData.payload;
      return airportPickupBookings;
    },
    refetchInterval: 10000,
  });
};
