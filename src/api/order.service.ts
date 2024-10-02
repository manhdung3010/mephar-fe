import type { EOrderStatus } from "@/enums";

import axiosClient from "./index";

export function getOrder(params: {
  page: number;
  limit: number;
  branchId?: number;
  status?: EOrderStatus;
  customerId?: number;
}) {
  return axiosClient.get("order", { params });
}

export function getSaleReturn(params: {
  page: number;
  limit: number;
  keyword?: string;
  branchId?: number;
  storeId?: number;
  from?: string;
  to?: string;
  status?: EOrderStatus;
  creatorId?: number;
  customerId?: number;
}) {
  return axiosClient.get("sale-return", { params });
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

export function getOrderDetail(id: number, params?: any) {
  return axiosClient.get(`order/${id}`, { params });
}

export function createOrder(payload) {
  return axiosClient.post(`order`, payload);
}
export function createOrderReturn(payload) {
  return axiosClient.post(`sale-return`, payload);
}
export function createOrderDebt(payload, id: number) {
  return axiosClient.post(`order/${id}/payment`, payload);
}

export function deleteOrder(id: number) {
  return axiosClient.delete(`order/${id}`);
}
