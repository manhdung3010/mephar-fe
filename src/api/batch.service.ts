import axiosClient from './index';

export function getBatch(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId: number;
  productId: number;
}) {
  return axiosClient.get('batch', { params });
}

export function getBatchDetail(id: number) {
  return axiosClient.get(`batch/${id}`);
}

export function updateBatch(id: number, payload) {
  return axiosClient.patch(`batch/${id}`, payload);
}

export function createBatch(payload) {
  return axiosClient.post(`batch`, payload);
}

export function deleteBatch(id: number) {
  return axiosClient.delete(`batch/${id}`);
}
