import axiosClient from '.';

export function getProfile() {
  return axiosClient.get(`auth/profile`);
}
