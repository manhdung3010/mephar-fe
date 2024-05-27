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
