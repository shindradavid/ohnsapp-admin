import { z } from 'zod';
import { useState, useCallback } from 'react';
import { FlatList, RefreshControl, Text, ToastAndroid, View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MainPageLayout } from '../../components/layout';
import { CustomButton, CustomFAB, CustomModal } from '../../components/common';
import { TextInputField } from '../../components/formInputs/TextInputField';
import { useAirports, useCreateAirportMutation } from '../../api/airportPickupsApi';

const createAirportDataSchema = z.object({
  name: z.string({ error: `The airport's name is required` }).trim(),
  code: z.string({ error: `The airport's code is required` }).trim().toUpperCase(),
  latitude: z
    .number({
      error: 'Latitude is required',
    })
    // Latitude ranges from -90 (South Pole) to 90 (North Pole)
    .min(-90, { message: 'Latitude must be ge -90' })
    .max(90, { message: 'Latitude must be le 90' }),
  longitude: z
    .number({
      error: 'Longitude is required',
    })
    // Longitude ranges from -180 (West) to 180 (East)
    .min(-180, { message: 'Longitude must be ge -180' })
    .max(180, { message: 'Longitude must be le 180' }),
});

type CreateAirportFormData = z.infer<typeof createAirportDataSchema>;

const AirportsScreen = () => {
  const [openCreateAirportModal, setOpenCreateAirportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(createAirportDataSchema),
  });

  const { data: airports, isLoading, error, refetch } = useAirports();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const createAirportMutation = useCreateAirportMutation();

  const handleCreateAirport: SubmitHandler<CreateAirportFormData> = (data) => {
    createAirportMutation.mutate(
      {
        name: data.name,
        code: data.code,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      {
        onError: (error) => {
          ToastAndroid.showWithGravity(error.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        },
        onSuccess: (apiResponse) => {
          reset();
          setOpenCreateAirportModal(false);
          ToastAndroid.showWithGravity(
            apiResponse.message ?? 'Airport created successfully.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        },
      },
    );
  };

  return (
    <MainPageLayout title="Airports">
      <FlatList
        data={airports}
        keyExtractor={(item) => item.id}
        renderItem={({ item: airport }) => (
          <View>
            <Text>{airport.name}</Text>
            <Text>{airport.code}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text>No airports found</Text>}
      />

      <CustomModal
        title="Create airport"
        visible={openCreateAirportModal}
        onClose={() => {
          setOpenCreateAirportModal(false);
          reset();
        }}
      >
        <TextInputField name="name" control={control} label="Name" placeholder="eg. Entebbe airport" />
        <TextInputField name="code" control={control} label="Code" placeholder="eg. EBB" />
        <TextInputField
          name="latitude"
          control={control}
          label="Latitude"
          placeholder="eg. 0.0450515"
          keyboardType="numeric"
        />
        <TextInputField
          name="longitude"
          control={control}
          label="Longitude"
          placeholder="eg. 32.4428212"
          keyboardType="numeric"
        />
        <CustomButton title="Create" onPress={handleSubmit(handleCreateAirport)} />
      </CustomModal>

      <CustomFAB onPress={() => setOpenCreateAirportModal(true)} />
    </MainPageLayout>
  );
};

export default AirportsScreen;
