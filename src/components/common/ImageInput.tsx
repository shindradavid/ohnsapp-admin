import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ImageFile } from '../../lib/types';

interface ImagePickerInputProps {
  label?: string;
  value?: ImageFile | null;
  onChange: (imageFile: ImageFile | null) => void;
  aspectRatio?: [number, number];
}

const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
  label = 'Select Image',
  value,
  onChange,
  aspectRatio = [1, 1],
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermissionGranted(status === 'granted');
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Camera roll access is needed.');
        }
      })();
    } else {
      setPermissionGranted(true); // Allow on web
    }
  }, []);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // Trigger hidden file input on web
      document.getElementById('webImageInput')?.click();
    } else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
          aspect: aspectRatio,
        });

        if (!result.canceled && result.assets?.[0]) {
          const asset = result.assets[0];
          onChange({
            uri: asset.uri,
            mimeType: asset.mimeType ?? 'image/jpeg',
            fileName: asset.fileName ?? 'photo.jpg',
          });
        }
      } catch (error) {
        console.error('Image pick error:', error);
      }
    }
  };

  const handleWebInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        onChange({
          uri: result,
          fileName: file.name,
          mimeType: file.type,
        });
      } else {
        console.warn('Unexpected reader result:', result);
      }
    };

    reader.onerror = (error) => {
      console.error('File reading error:', error);
    };

    reader.readAsDataURL(file); // This converts the image to base64 URI
  };

  const removeImage = () => {
    Alert.alert('Remove Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onChange(null),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable style={styles.imageBox} onPress={pickImage}>
        {value ? (
          <Image source={{ uri: value.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContent}>
            <Ionicons name="image-outline" size={48} color="#9ca3af" />
            <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        )}
      </Pressable>

      {Platform.OS === 'web' && (
        <input id="webImageInput" type="file" accept="image/*" onChange={handleWebInputChange} style={{ display: 'none' }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
  },
  imageBox: {
    height: 160,
    width: 160,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 6,
    color: '#9ca3af',
    fontSize: 14,
  },
});

export default ImagePickerInput;
