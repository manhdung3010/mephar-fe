import axiosClient from "./index";

export function createConfigProduct(payload) {
  return axiosClient.post(`market/config/product`, payload);
}
export function getConfigProduct(params: {
  page: number;
  limit: number;
  keyword: any;
  status?: any;
  type?: string;
  groupAgencyId?: string;
  agencyId?: string;
  groupProductId?: string;
  "createdAt[start]"?: string;
  "createdAt[end]"?: string;
  isConfig?: boolean;
}) {
  return axiosClient.get(`market/config/product`, { params });
}

export function deleteConfigProduct(id: string) {
  return axiosClient.delete(`market/config/product/${id}`);
}
export function getConfigProductDetail(id: string) {
  return axiosClient.get(`market/config/product/${id}`);
}
