import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { ImageFile } from '../../lib/types';

type ImagePickerFieldProps<T extends FieldValues> = {
  name: keyof T;
  control: Control<T>;
  label?: string;
  aspectRatio?: [number, number];
  rules?: object;
};

export function ImageField<T extends FieldValues>({
  name,
  control,
  label = 'Select Image',
  aspectRatio = [1, 1],
  rules = {},
}: ImagePickerFieldProps<T>) {
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
      setPermissionGranted(true); // Web allows it by default
    }
  }, []);

  const pickImage = async (onChange: (image: ImageFile | null) => void) => {
    if (!permissionGranted) {
      Alert.alert('Permission not granted', 'Please enable media permissions.');
      return;
    }

    if (Platform.OS === 'web') {
      document.getElementById('webImageInput')?.click();
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: aspectRatio,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const imageFile: ImageFile = {
          uri: asset.uri,
          mimeType: asset.mimeType ?? 'image/jpeg',
          fileName: asset.fileName ?? 'photo.jpg',
        };
        onChange(imageFile);
      }
    } catch (error) {
      console.error('Image pick error:', error);
    }
  };

  const handleWebInputChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (image: ImageFile | null) => void) => {
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
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (onChange: (image: ImageFile | null) => void) => {
    Alert.alert('Remove Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onChange(null) },
    ]);
  };

  return (
    <Controller
      control={control}
      name={name as any}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}

          <Pressable style={[styles.imageBox, error && { borderColor: '#f87171' }]} onPress={() => pickImage(onChange)}>
            {value ? (
              <Image source={{ uri: value.uri }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContent}>
                <Ionicons name="image-outline" size={48} color="#9ca3af" />
                <Text style={styles.placeholderText}>Tap to select image</Text>
              </View>
            )}
          </Pressable>

          {value && (
            <Pressable style={styles.removeButton} onPress={() => removeImage(onChange)}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          )}

          {Platform.OS === 'web' && (
            <input
              id="webImageInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleWebInputChange(e, onChange)}
              style={{ display: 'none' }}
            />
          )}

          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

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
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  removeText: {
    color: '#ef4444',
    fontSize: 14,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
  },
});

export default ImageField;
