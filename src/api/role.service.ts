import axiosClient from './index';

export function getRole(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('role', { params });
}

export function getRoleDetail(id: number) {
  return axiosClient.get(`role/${id}`);
}

export function updateRole(id: number, payload) {
  return axiosClient.patch(`role/${id}`, payload);
}

export function createRole(payload) {
  return axiosClient.post(`role`, payload);
}

export function deleteRole(id: number) {
  return axiosClient.delete(`role/${id}`);
}
