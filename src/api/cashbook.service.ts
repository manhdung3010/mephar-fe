import axiosClient from "./index";

// export function getBranch(params?: {
//   page: number;
//   limit: number;
//   keyword?: string;
// }) {
//   return axiosClient.get('branch', { params });
// }

// export function getBranchDetail(id: number) {
//   return axiosClient.get(`branch/${id}`);
// }

// export function updateBranch(id: number, payload) {
//   return axiosClient.patch(`branch/${id}`, payload);
// }

export function createTypeTransaction(payload) {
  return axiosClient.post(`type-transaction`, payload);
}

export function getTypeTransaction(type: string) {
  return axiosClient.get(`type-transaction/${type}`);
}
export function getUserTransaction() {
  return axiosClient.get(`user-transaction`);
}

export function createOtherUser(payload) {
  return axiosClient.post(`user-transaction`, payload);
}
export function createTransaction(payload) {
  return axiosClient.post(`transaction`, payload);
}
export function updateTransaction(id, payload) {
  return axiosClient.patch(`transaction/${id}`, payload);
}
export function deleteTransaction(id) {
  return axiosClient.delete(`transaction/${id}`);
}
export function getTransaction(params?: {
  page: number;
  limit: number;
  keyword?: string;
  ballotType?: string;
  branchId?: number;
}) {
  return axiosClient.get(`transaction`, { params });
}
export function getTransactionTotal(
  params?: {
    ballotType?: string;
  },
  type?: string
) {
  return axiosClient.get(`transaction/total/${type}`, { params });
}
export function getTransactionDetail(id?: string) {
  return axiosClient.get(`transaction/${id}`);
}
