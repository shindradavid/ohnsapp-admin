import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { Alert, Linking, Platform, Share } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import * as Contacts from 'expo-contacts';
import { format } from 'date-fns';

import { ImageFile } from './types';

export const handleOpenWhatsApp = (phoneNumber: string) => {
  let phone = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters

  if (phone.startsWith('0') && phone.length === 10) {
    phone = `256${phone.slice(1)}`;
  } else if (phone.length === 10) {
    phone = `256${phone}`;
  } else if (phone.startsWith('+')) {
    phone = phone.slice(1);
  }

  const url = `https://wa.me/${phone}`;

  Linking.openURL(url).catch(() => {
    Alert.alert('Error', 'Could not open WhatsApp. Make sure it is installed.');
  });
};

export const handleCall = (phoneNumber: string) => {
  let phone = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters

  if (phone.startsWith('0') && phone.length === 10) {
    phone = `256${phone.slice(1)}`; // Replace 0 with 256
  } else if (phone.length === 10) {
    phone = `256${phone}`; // Assume it's missing 256
  } else if (phone.startsWith('+')) {
    phone = phone.slice(1); // Remove plus sign
  }

  const url = `tel:${phone}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Calling is not supported on this device');
      }
    })
    .catch((err) => console.error('An error occurred', err));
};

export const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// PICKERS

export const pickImage = async (): Promise<ImageFile | null> => {
  let result = await launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
    base64: true,
  });

  if (!result.canceled) {
    const pickedImage = result.assets?.at(0);

    if (pickedImage?.fileName && pickedImage?.uri && pickedImage.mimeType) {
      return {
        fileName: pickedImage.fileName,
        mimeType: pickedImage.mimeType,
        uri: pickedImage.uri,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// PLATFORM AGNOSTIC STORAGE UTILITIES

export const setStorageItem = async (key: string, value: any) => {
  if (isWeb) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }
};

export const getStorageItem = async (key: string) => {
  if (isWeb) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } else {
    const item = await SecureStore.getItemAsync(key);
    return item ? JSON.parse(item) : null;
  }
};

export const removeStorageItem = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Date utils
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const humanizeDate = (date: Date) => format(date, 'LLLL do yyyy');

// Currency
export function formatCurrency(amount: number, currencyCode: string = 'UGX', locale: string = 'en-US'): string {
  return amount?.toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
  });
}

export const combineDateAndTime = (date: Date, time: string): string => {
  return `${format(date, 'yyyy-MM-dd')}T${time}`;
};

export const normalizePhoneNumber = (raw: string): string => {
  try {
    // Remove all spaces and non-digit characters except '+' (e.g., "+256 782 346200" => "+256782346200")
    const cleaned = raw.replace(/[^\d+]/g, '');

    const phoneNumber = parsePhoneNumberWithError(cleaned, 'UG');
    if (!phoneNumber.isValid()) {
      throw new Error('Invalid phone number');
    }
    return phoneNumber.number; // Returns in E.164 format, e.g., +256782346200
  } catch (error) {
    throw new Error('Invalid phone number format');
  }
};

export const base64ToBlob = (base64Data: string, contentType: string): Blob => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const selectContact = async (): Promise<any | null> => {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status !== 'granted') return null;

  const contact = await Contacts.presentContactPickerAsync();

  if (!contact) return null;

  const { name, phoneNumbers } = contact;

  const phoneNumber = phoneNumbers?.at(0);

  if (!phoneNumber) return null;

  if (!phoneNumber.number) return null;

  return {
    name: name,
    phoneNumber: phoneNumber.number,
  };
};
