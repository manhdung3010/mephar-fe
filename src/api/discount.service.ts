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
