import axiosClient from './index';

export function getGroupProvider(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('group-supplier', { params });
}

export function getGroupProviderDetail(id: number) {
  return axiosClient.get(`group-supplier/${id}`);
}

export function updateGroupProvider(id: number, payload) {
  return axiosClient.patch(`group-supplier/${id}`, payload);
}

export function createGroupProvider(payload) {
  return axiosClient.post(`group-supplier`, payload);
}

export function deleteGroupProvider(id: number) {
  return axiosClient.delete(`group-supplier/${id}`);
}
