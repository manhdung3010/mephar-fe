import axiosClient from '.';

export function getProfile() {
  return axiosClient.get(`auth/profile`);
}
export function getUserLog(params) {
  return axiosClient.get(`user_log`, { params });
}
