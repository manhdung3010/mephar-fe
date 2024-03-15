import axiosClient from './index';

export function getMedicineCategory(params: {
  page: number;
  limit: number;
  keyword?: string;
  name?: string;
}) {
  return axiosClient.get('medication-category', { params });
}

export function searchMedicineCategory(code?: string) {
  return axiosClient.get(`medication-category/code/${code}`);
}

export function updateMedicineCategory(id: number, payload) {
  return axiosClient.patch(`medication-category/${id}`, payload);
}

export function createMedicineCategory(payload) {
  return axiosClient.post(`medication-category`, payload);
}

export function deleteMedicineCategory(id: number) {
  return axiosClient.delete(`medication-category/${id}`);
}
