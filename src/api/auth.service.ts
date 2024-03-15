import axiosClient from './index';

export function login(payload: { username: string; password: string }) {
  return axiosClient.post('auth/login', payload);
}
