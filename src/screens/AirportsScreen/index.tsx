import { z } from 'zod';
import { useState, useCallback } from 'react';
import { FlatList, RefreshControl, Text, ToastAndroid, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MainPageLayout } from '../../components/layout';
import { CustomButton, CustomFAB, CustomModal } from '../../components/common';
import { TextInputField } from '../../components/formInputs/TextInputField';
import { useAirports, useCreateAirportMutation } from '../../api/airportPickupsApi';
import { APP_COLORS } from '../../lib/constants';
import { NumberInputField } from '../../components/formInputs/NumberInputField';

const createAirportDataSchema = z.object({
  name: z.string({ error: `The airport's name is required` }).trim(),
  code: z.string({ error: `The airport's code is required` }).trim().toUpperCase(),
  latitude: z
    .number({ error: 'Latitude is required' })
    .min(-90, { message: 'Latitude must be ≥ -90' })
    .max(90, { message: 'Latitude must be ≤ 90' }),
  longitude: z
    .number({ error: 'Longitude is required' })
    .min(-180, { message: 'Longitude must be ≥ -180' })
    .max(180, { message: 'Longitude must be ≤ 180' }),
});

type CreateAirportFormData = z.infer<typeof createAirportDataSchema>;

const AirportsScreen = () => {
  const [openCreateAirportModal, setOpenCreateAirportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(createAirportDataSchema),
  });

  const { data: airports, isLoading, error: isError, refetch } = useAirports();

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
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={APP_COLORS.accent1} />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load airports. Pull to retry.</Text>
        </View>
      ) : (
        <FlatList
          data={airports ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.airportCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.airportName}>{item.name}</Text>
                <Text style={styles.airportCode}>{item.code}</Text>
              </View>

              <View style={styles.coords}>
                <Text style={styles.coordText}>
                  Lat: {item.latitude}, Lng: {item.longitude}
                </Text>
              </View>

              {!item.isActive && <Text style={styles.inactiveTag}>Inactive</Text>}
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 12 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No airports found. Pull to refresh.</Text>}
        />
      )}

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
        <NumberInputField name="latitude" control={control} label="Latitude" placeholder="eg. 0.0450515" />
        <NumberInputField name="longitude" control={control} label="Longitude" placeholder="eg. 32.4428212" />
        <CustomButton title="Create" onPress={handleSubmit(handleCreateAirport)} />
      </CustomModal>

      <CustomFAB onPress={() => setOpenCreateAirportModal(true)} />
    </MainPageLayout>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#970606FF',
  },
  airportCard: {
    backgroundColor: APP_COLORS.bgPrimary,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  airportName: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_COLORS.txtPrimaryOnBgPrimary,
  },
  airportCode: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_COLORS.accent1,
  },
  coords: {
    marginTop: 6,
  },
  coordText: {
    color: APP_COLORS.txtSecondaryOnBgPrimary,
    fontSize: 13,
  },
  inactiveTag: {
    color: 'gray',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: APP_COLORS.txtSecondaryOnBgPrimary,
    marginTop: 50,
  },
});

export default AirportsScreen;
