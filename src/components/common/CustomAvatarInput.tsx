import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import type { ImageFile } from '../../lib/types';
import Toast from 'react-native-toast-message';

type CustomAvatarInputProps = {
  label?: string;
  size?: number;
  onImageSelected: (photo: ImageFile) => void;
};

const CustomAvatarInput: React.FC<CustomAvatarInputProps> = ({ size = 100, onImageSelected, label }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const photo = result.assets[0];

      if (photo.uri && photo.mimeType && photo.fileName) {
        const uri = photo.uri;
        const mimeType = photo.mimeType;
        const fileName = photo.fileName;
        setImageUri(uri);
        onImageSelected?.({ uri, mimeType, fileName });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error loading image',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'No image selected',
      });
    }
  };

  return (
    <Pressable style={[styles.avatarContainer, { width: size, height: size }]} onPress={pickImage}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.avatar, { width: size, height: size }]} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Ionicons name="camera" size={size / 3} color="gray" />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    borderRadius: 50,
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomAvatarInput;
