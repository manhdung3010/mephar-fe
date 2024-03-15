import { EStorageKey } from '../enums/index';

const store = typeof window !== 'undefined' ? window.localStorage : null;

export const setItem = (key: EStorageKey, value: any) => {
  store?.setItem(key, value);
};

export const getItem = (key: EStorageKey) => {
  const value = store?.getItem(key);
  return value === null ? '' : value;
};

export const setToken = (value: string) => {
  setItem(EStorageKey.ACCESS_TOKEN, value);
};

export const getToken = () => getItem(EStorageKey.ACCESS_TOKEN);

export const clearToken = () => setToken('');

export const setRefreshToken = (value: string) => {
  setItem(EStorageKey.REFRESH_TOKEN, value);
};

export const getRefreshToken = () => getItem(EStorageKey.REFRESH_TOKEN);

export const clearRefreshToken = () => setRefreshToken('');
