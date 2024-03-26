import axiosClient from "./index";

export function getCustomer(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get("customer", { params });
}

export function getCustomerDetail(id: number) {
  return axiosClient.get(`customer/${id}`);
}

export function updateStatusCustomer(id: number, payload) {
  return axiosClient.patch(`customer/${id}/status`, payload);
}

export function updateCustomer(id: number, payload) {
  return axiosClient.put(`customer/${id}`, payload);
}

export function createCustomer(payload) {
  return axiosClient.post(`customer`, payload);
}

export function deleteCustomer(id: number) {
  return axiosClient.delete(`customer/${id}`);
}
