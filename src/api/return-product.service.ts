import axiosClient from "./index";

export function getReturnProduct(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId: number;
  userId?: number;
  dateRange?: { startDate?: string; endDate?: string };
}) {
  return axiosClient.get("purchase-return", { params });
}

export function getReturnProductDetail(id: number) {
  return axiosClient.get(`purchase-return/${id}`);
}

export function updateReturnProduct(id: number, payload) {
  return axiosClient.patch(`purchase-return/${id}`, payload);
}

export function createReturnProduct(payload) {
  return axiosClient.post(`purchase-return`, payload);
}

export function deleteReturnProduct(id: number) {
  return axiosClient.delete(`purchase-return/${id}`);
}

// lịch sử thanh toán
export function getReturnPaymentHistory(
  params: {
    page: number;
    limit: number;
  },
  id: number
) {
  return axiosClient.get(`sale-return/${id}/history-payment`, { params });
}
