import { z } from 'zod';
import { useState, useCallback } from 'react';
import { FlatList, RefreshControl, Text, ToastAndroid, View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SubmitHandler, SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MainPageLayout, SecondaryPageLayout } from '../../components/layout';
import { CustomButton, CustomFAB, CustomModal } from '../../components/common';
import { TextInputField } from '../../components/formInputs/TextInputField';
import { useAirportPickupRideOption, useCreateAirportPickupRideOptionMutation } from '../../api/airportPickupsApi';
import { APP_COLORS, APP_SIZES } from '../../lib/constants';
import ImageField from '../../components/formInputs/ImageField';
import { NumberInputField } from '../../components/formInputs/NumberInputField';

const createAirportPickupRideOptionDataSchema = z.object({
  name: z.string({ error: `The airport's name is required` }).trim(),
  pricePerMileUgx: z.number(),
  pricePerMileUsd: z.number(),
  photo: z.object({
    uri: z.url(),
    fileName: z.string(),
    mimeType: z.string(),
  }),
});

type CreateAirportPickupRideOptionFormData = z.infer<typeof createAirportPickupRideOptionDataSchema>;

const AirportPickupRideOptionsScreen = () => {
  const [openCreateAirportPickupRideOptionModal, setOpenCreateAirportPickupRideOptionsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(createAirportPickupRideOptionDataSchema),
  });

  const { data: rideOptions, isLoading, error: isError, refetch } = useAirportPickupRideOption();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const createAirportPickupRideOptionMutation = useCreateAirportPickupRideOptionMutation();

  const handleCreateAirportRideOption: SubmitHandler<CreateAirportPickupRideOptionFormData> = (data) => {
    createAirportPickupRideOptionMutation.mutate(
      {
        name: data.name,
        pricePerMileUgx: data.pricePerMileUgx,
        pricePerMileUsd: data.pricePerMileUsd,
        photo: data.photo,
      },
      {
        onError: (error) => {
          ToastAndroid.showWithGravity(error.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        },
        onSuccess: (apiResponse) => {
          reset();
          setOpenCreateAirportPickupRideOptionsModal(false);
          ToastAndroid.showWithGravity(
            apiResponse.message ?? 'Ride option created successfully.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        },
      },
    );
  };

  return (
    <MainPageLayout title="Ride options">
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={APP_COLORS.accent1} />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load ride options. Pull to retry.</Text>
        </View>
      ) : (
        <FlatList
          data={rideOptions ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No ride options found. Pull to refresh.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.photoUrl }} style={styles.image} resizeMode="cover" />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.priceText}>UGX {item.pricePerMileUgx.toLocaleString()}/mile</Text>
                <Text style={styles.priceText}>USD ${item.pricePerMileUsd.toFixed(2)}/mile</Text>

                <Text style={styles.dateText}>Added on {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Create Modal */}
      <CustomModal
        title="Create Ride Option"
        visible={openCreateAirportPickupRideOptionModal}
        onClose={() => {
          setOpenCreateAirportPickupRideOptionsModal(false);
          reset();
        }}
      >
        <TextInputField name="name" control={control} label="Name" placeholder="e.g. Business Class" />
        <NumberInputField name="pricePerMileUgx" control={control} label="Price per Mile (UGX)" />
        <NumberInputField name="pricePerMileUsd" control={control} label="Price per Mile (USD)" />
        <ImageField control={control} name="photo" label="Photo" aspectRatio={[16, 9]} />

        <CustomButton
          title="Create"
          onPress={handleSubmit(handleCreateAirportRideOption)}
          loading={createAirportPickupRideOptionMutation.isPending}
        />
      </CustomModal>

      <CustomFAB onPress={() => setOpenCreateAirportPickupRideOptionsModal(true)} />
    </MainPageLayout>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: APP_SIZES.spacingMd,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 12,
    padding: 8,
  },
  image: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    borderRadius: 10,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: APP_COLORS.txtPrimaryOnBgPrimary,
    marginBottom: 4,
  },
  priceText: {
    color: APP_COLORS.txtSecondaryOnBgPrimary,
    fontSize: 12,
  },
  dateText: {
    fontSize: 11,
    color: APP_COLORS.txtSecondaryOnBgPrimary,
  },
  errorContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#920B0BFF',
  },
  emptyText: {
    textAlign: 'center',
    color: APP_COLORS.txtSecondaryOnBgPrimary,
    marginTop: 40,
  },
});

export default AirportPickupRideOptionsScreen;
