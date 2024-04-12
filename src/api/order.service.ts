import type { EOrderStatus } from "@/enums";

import axiosClient from "./index";

export function getOrder(params: {
  page: number;
  limit: number;
  branchId: number;
  status?: EOrderStatus;
  customerId?: number;
}) {
  return axiosClient.get("order", { params });
}
export function getOrderHistory(
  params: {
    page: number;
    limit: number;
  },
  id: number
) {
  return axiosClient.get(`order/${id}/payment-history`, { params });
}

export function updateOrder(id: number, payload) {
  return axiosClient.patch(`order/${id}`, payload);
}

export function getOrderDetail(id: number) {
  return axiosClient.get(`order/${id}`);
}

export function createOrder(payload) {
  return axiosClient.post(`order`, payload);
}

export function deleteOrder(id: number) {
  return axiosClient.delete(`order/${id}`);
}
