import * as SecureStore from 'expo-secure-store';

import { isWeb } from '../lib/utils';

export const createStorageItem = async (key: string, value: any) => {
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

export const deleteStorageItem = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};
