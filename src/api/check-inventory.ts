import axiosClient from "./index";

export function getInventoryChecking(params?: {
  page: number;
  limit: number;
  keyword?: string;
  branchId?: number;
}) {
  return axiosClient.get("inventory-checking", { params });
}

// export function getBranchDetail(id: number) {
//   return axiosClient.get(`branch/${id}`);
// }

// export function updateBranch(id: number, payload) {
//   return axiosClient.patch(`branch/${id}`, payload);
// }

export function createCheckInventory(payload) {
  return axiosClient.post(`inventory-checking`, payload);
}
