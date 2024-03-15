import axiosClient from './index';

export function getProvider(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('supplier', { params });
}

export function getProviderDetail(id: number) {
  return axiosClient.get(`supplier/${id}`);
}

export function updateProvider(id: number, payload) {
  return axiosClient.patch(`supplier/${id}`, payload);
}

export function createProvider(payload) {
  return axiosClient.post(`supplier`, payload);
}

export function deleteProvider(id: number) {
  return axiosClient.delete(`supplier/${id}`);
}
