import axiosClient from "./index";

export function getDiscount(params: {
  page: number;
  limit: number;
  keyword?: string;
  name?: string;
  target?: string;
  method?: string;
  status?: string;
  effective?: string;
}) {
  return axiosClient.get("discount", { params });
}

export function createDiscount(payload) {
  return axiosClient.post("discount", payload);
}
export function updateDiscount(payload, id: number) {
  return axiosClient.put(`discount/${id}`, payload);
}
export function deleteDiscount(id: number) {
  return axiosClient.delete(`discount/${id}`);
}
export function getDiscountDetail(id: number) {
  return axiosClient.get(`discount/${id}`);
}

export function getDiscountByIdOrder(id: number) {
  return axiosClient.get(`order/${id}/get-discount`);
}

export function getOrderDiscountList(payload) {
  return axiosClient.post("discount/order", payload);
}
export function getProductDiscountList(payload) {
  return axiosClient.post("discount/product", payload);
}
export function getDiscountConfig() {
  return axiosClient.get("discount/config/detail");
}
export function updateDiscountConfig(payload) {
  return axiosClient.post("discount/config", payload);
}
