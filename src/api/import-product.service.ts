import axiosClient from './index';

export function getImportProduct(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId: number;
  userId?: number;
  dateRange?: { startDate?: string; endDate?: string };
}) {
  return axiosClient.get('inbound', { params });
}

export function getImportProductDetail(id: number) {
  return axiosClient.get(`inbound/${id}`);
}

export function updateImportProduct(id: number, payload) {
  return axiosClient.patch(`inbound/${id}`, payload);
}

export function createImportProduct(payload) {
  return axiosClient.post(`inbound`, payload);
}

export function deleteImportProduct(id: number) {
  return axiosClient.delete(`inbound/${id}`);
}
