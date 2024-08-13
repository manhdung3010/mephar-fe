import axiosClient from "./index";

export function createConfigProduct(payload) {
  return axiosClient.post(`market/config/product`, payload);
}
export function updateConfigProduct(id, payload) {
  return axiosClient.patch(`market/config/product/${id}`, payload);
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
export function updateConfigStatus(id: string, status: string) {
  return axiosClient.patch(
    `market/config/product/changeStatus/${id}/${status}`
  );
}
export function getConfigProductDetail(id: string) {
  return axiosClient.get(`market/config/product/${id}`);
}

// đại lý
export function getAgency(params) {
  return axiosClient.get(`market/config/agency`, { params });
}
export function getAgencyGroup(params) {
  return axiosClient.get(`market/config/group-agency`, { params });
}

// Chợ
export function getSaleProductDetail(id: string) {
  return axiosClient.get(`market/sell/product/${id}`);
}
export function createMarketCart(payload) {
  return axiosClient.post(`market/sell/cart`, payload);
}
export function getMarketCart(params) {
  return axiosClient.get(`market/sell/cart`, { params });
}
export function deletMarketCart(id: string) {
  return axiosClient.delete(`market/sell/cart/${id}`);
}
export function updateMarketCart(id: string, quantity: number) {
  return axiosClient.patch(`market/sell/cart/${id}/${quantity}`);
}
export function createShipAddress(payload) {
  return axiosClient.post(`market/sell/address`, payload);
}
export function updateShipAddress(
  id: string,
  branchId?: string,
  payload?: any
) {
  return axiosClient.patch(
    `market/sell/address/${id}?branchId=${branchId}`,
    payload
  );
}
export function getShipAddress(params) {
  return axiosClient.get(`market/sell/address`, { params });
}
export function getShipAddressDetail(id: string, branchId: string) {
  return axiosClient.get(`market/sell/address/${id}?branchId=${branchId}`);
}

// order
export function createMarketOrder(payload) {
  return axiosClient.post(`market/sell/market-order`, payload);
}
export function getMarketOrder(params) {
  return axiosClient.get(`market/sell/market-order`, { params });
}
export function getMarketOrderDetail(id: string) {
  return axiosClient.get(`market/sell/market-order/${id}`);
}

// store
export function getMarketStore() {
  return axiosClient.get(`market/sell/store`);
}
export function getMarketStoreDetail(id: string) {
  return axiosClient.get(`market/sell/store/${id}`);
}
