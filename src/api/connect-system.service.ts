import axiosClient from './index';

export function getConnectSystem(params?: { branchId: number }) {
  return axiosClient.get('nps', { params });
}

export function getConnectSystemDetail(id: number) {
  return axiosClient.get(`nps/${id}`);
}

export function updateConnectSystem(id: number, payload) {
  return axiosClient.patch(`nps/${id}`, payload);
}

export function createConnectSystem(payload) {
  return axiosClient.post(`nps`, payload);
}

export function deleteConnectSystem(id: number) {
  return axiosClient.delete(`nps/${id}`);
}
