import axiosClient from './index';

export function getBranch(params?: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('branch', { params });
}

export function getBranchDetail(id: number) {
  return axiosClient.get(`branch/${id}`);
}

export function updateBranch(id: number, payload) {
  return axiosClient.patch(`branch/${id}`, payload);
}

export function createBranch(payload) {
  return axiosClient.post(`branch`, payload);
}

export function deleteBranch(id: number) {
  return axiosClient.delete(`branch/${id}`);
}
