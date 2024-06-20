import axiosClient from "./index";

export function getInventoryChecking(params?: {
  page: number;
  limit: number;
  keyword?: string;
  branchId?: number;
}) {
  return axiosClient.get("inventory-checking", { params });
}

export function getInventoryDetail(id: number, branchId: number) {
  return axiosClient.get(`inventory-checking/${id}?branchId=${branchId}`);
}

export function deleteInventoryChecking(id: number, branchId: number) {
  return axiosClient.delete(`inventory-checking/${id}?branchId=${branchId}`);
}

export function createCheckInventory(payload) {
  return axiosClient.post(`inventory-checking`, payload);
}
