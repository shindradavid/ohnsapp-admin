import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiResponse, ImageFile } from '../lib/types';
import apiClient from '../lib/apiClient';

export interface Airport {
  id: string;
  name: string;
  code: string;
  longitude: number;
  latitude: number;
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

export interface AirportPickupRideOption {
  id: string;
  name: string;
  pricePerMileUgx: number;
  pricePerMileUsd: number;
  photoUrl: string;
  createdAt: string;
}

export const airportPickupRideOptionQueryKey = 'airportPickupRideOptionQueryKey';

export const useAirportPickupRideOption = () => {
  return useQuery({
    queryKey: [airportPickupRideOptionQueryKey],
    queryFn: async () => {
      const axiosData = (await apiClient.get<ApiResponse<AirportPickupRideOption[]>>('/airport-pickups/ride-options')).data;
      const airportPickupRideOptions = axiosData.payload;
      return airportPickupRideOptions;
    },
    refetchInterval: 10000,
  });
};

interface CreateAirportPickupRideOptionMutationPayload {
  name: string;
  pricePerMileUgx: number;
  pricePerMileUsd: number;
  photo: {
    uri: string;
    mimeType: string;
    fileName: string;
  };
}

export const useCreateAirportPickupRideOptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAirportPickupRideOptionMutationPayload) => {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('pricePerMileUgx', payload.pricePerMileUgx.toString());
      formData.append('pricePerMileUsd', payload.pricePerMileUsd.toString());
      formData.append('photo', {
        uri: payload.photo.uri,
        type: payload.photo.mimeType,
        name: payload.photo.fileName,
      } as any);

      const axiosData = (
        await apiClient.post<ApiResponse<AirportPickupRideOption>>('/airport-pickups/ride-options', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data;

      return axiosData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [airportPickupRideOptionQueryKey] });
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
