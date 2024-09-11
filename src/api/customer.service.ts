import axiosClient from "./index";

export function getCustomer(params: {
  page: number;
  limit: number;
  keyword?: any;
  isDefault?: boolean;
  status?: string;
}) {
  return axiosClient.get("customer", { params });
}

export function getCustomerDebt(
  params: {
    page: number;
    limit: number;
    keyword?: string;
  },
  id: any
) {
  return axiosClient.get(`customer/${id}/total-debt`, { params });
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

export function getPointHistory(
  id: number,
  params: { page: number; limit: number; branchId: number }
) {
  return axiosClient.get(`customer/${id}/history-point`, { params });
}

export function updateCustomerPoint(id, payload) {
  return axiosClient.patch(`point/${id}`, payload);
}
export function getNoteList(id: number) {
  return axiosClient.get(`customer-note/${id}`);
}

export function createCustomerNote(payload) {
  return axiosClient.post(`customer-note`, payload);
}

// lịch sử thanh toán
export function paymentHistory(id: number, params) {
  return axiosClient.get(`customer/${id}/payment`, { params });
}
