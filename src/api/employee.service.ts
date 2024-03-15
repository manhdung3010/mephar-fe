import axiosClient from './index';

export function getEmployee(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('user', { params });
}

export function getEmployeeDetail(id: number) {
  return axiosClient.get(`user/${id}`);
}

export function updateEmployee(id: number, payload) {
  return axiosClient.patch(`user/${id}`, payload);
}

export function createEmployee(payload) {
  return axiosClient.post(`user`, payload);
}

export function deleteEmployee(id: number) {
  return axiosClient.delete(`user/${id}`);
}
