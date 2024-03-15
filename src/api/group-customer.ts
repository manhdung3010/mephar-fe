import axiosClient from './index';

export function getGroupCustomer(params: {
  page: number;
  limit: number;
  keyword?: string;
}) {
  return axiosClient.get('group-customer', { params });
}

export function getGroupCustomerDetail(id: number) {
  return axiosClient.get(`group-customer/${id}`);
}

export function updateGroupCustomer(id: number, payload) {
  return axiosClient.patch(`group-customer/${id}`, payload);
}

export function createGroupCustomer(payload) {
  return axiosClient.post(`group-customer`, payload);
}

export function deleteGroupCustomer(id: number) {
  return axiosClient.delete(`group-customer/${id}`);
}
