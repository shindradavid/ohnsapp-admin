import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, Pressable, Text } from 'react-native';
import { APP_COLORS, APP_SIZES } from '../../lib/constants';
import { Ionicons } from '@expo/vector-icons';
import { ImageFile } from '../../lib/types';

import * as ImagePicker from 'expo-image-picker';

type CustomMultipleImagePickerProps = {
  label?: string;
  onImagesSelected: (photos: ImageFile[]) => void;
};

const CustomMultipleImagePicker: React.FC<CustomMultipleImagePickerProps> = ({ onImagesSelected, label }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionGranted(status === 'granted');

      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll access is needed.');
      }
    })();
  }, []);

  const pickImages = async () => {
    console.log('Called image picker');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [
        ...images,
        ...result.assets
          .filter((asset) => {
            if (asset.fileName && asset.mimeType && asset.uri) {
              return true;
            } else {
              return false;
            }
          })
          .map((asset) => ({ fileName: asset.fileName, mimeType: asset.mimeType, uri: asset.uri })),
      ];
      setImages(newImages);
      onImagesSelected && onImagesSelected(newImages);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesSelected && onImagesSelected(updatedImages);
  };

  return (
    <View style={{ marginVertical: 6 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <Pressable style={styles.addButton} onPress={pickImages}>
          <Ionicons name="add" size={APP_SIZES.fsLg} color={APP_COLORS.white} />
        </Pressable>

        {images.length !== 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />

                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={26} color={APP_COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.imagePlaceholder}></View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: APP_SIZES.pagePadding,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: APP_SIZES.spacingXs,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 25,
    backgroundColor: APP_COLORS.accent1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: APP_SIZES.spacingMd,
  },
  imageContainer: {
    position: 'relative',
    marginRight: APP_SIZES.spacingSm,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  imagePlaceholder: {
    marginRight: APP_SIZES.spacingSm,
    width: 98,
    height: 98,
    borderRadius: 10,
    borderColor: '#A9A9A9FF',
    borderWidth: 1,
  },
  image: {
    width: 98,
    height: 98,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    backgroundColor: APP_COLORS.txtPrimaryOnBgAccent2,
    padding: 2,
    zIndex: 10, // 👈 Add this
  },
});

export default CustomMultipleImagePicker;
