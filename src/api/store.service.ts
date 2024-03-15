import axiosClient from './index';

export function getStore() {
  return axiosClient.get('store');
}

export function updateStore(id: number, payload) {
  return axiosClient.patch(`store/${id}`, payload);
}
